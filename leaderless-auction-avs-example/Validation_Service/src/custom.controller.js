"use strict";
const { Router } = require("express")
const { ethers } = require('ethers');
const { keccak256, toUtf8Bytes } = require("ethers");
const axios = require("axios");

const commitments = new Map(); // { nodeId: { commitment, salt, bid } }
const revealedBids = new Map(); // { nodeId: { bid, salt } }
const nodeAccount = new ethers.Wallet(process.env.PRIVATE_KEY); // The signing key for performing tasks

const COMMIT_DURATION = 5000;
const REVEAL_DURATION = 10000;

const AUCTION_START = "auction/start";
const AUCTION_BID_COMMIT = "auction/bid_commit";
const AUCTION_BID_REVEAL = "auction/bid_reveal";

const router = Router()

async function commitBid(nodeId, bid) {
    const salt = Math.random().toString(36).substring(2);
    const commitment = generateCommitment(bid, salt);

    commitments.set(nodeId, { commitment, salt, bid });
    await publishTask(AUCTION_BID_COMMIT, { nodeId, commitment });
    console.log(`[${nodeId}] Committed bid: ${bid}, Salt: ${salt}`);
}

async function revealBid(nodeId) {
    const bidData = commitments.get(nodeId);
    console.log("bid data", bidData)
    if (!bidData) {
        console.log(`[${nodeId}] No commitment found`);
        return;
    }

    const { bid, salt } = bidData;
    await publishTask(AUCTION_BID_REVEAL, { nodeId, bid, salt });
    console.log(`[${nodeId}] Revealed bid: ${bid}, Salt: ${salt}`);
}

function generateCommitment(bid, salt) {
    return keccak256(toUtf8Bytes(bid.toString() + salt));
}

function verifyBid(nodeId, bid, salt, commitment) {
    return generateCommitment(bid, salt) === commitment;
}

async function determineWinner() {
    console.log("Revealed Bids", revealedBids);
    let highestBid = 0;
    let winnerNodeId = null;

    for (const [nodeId, { bid, salt }] of revealedBids) {
        const commitment = commitments.get(nodeId)?.commitment;
        if (verifyBid(nodeId, bid, salt, commitment)) {
            if (bid > highestBid) {
                highestBid = bid;
                winnerNodeId = nodeId;
            }
        }
    }

    if (winnerNodeId) {
        console.log(`[RESULT] Winner: ${winnerNodeId} with bid: ${highestBid}`);
        
        // If current node is the winner, execute the task
        if (winnerNodeId === nodeAccount.address) {
            console.log(`[EXECUTION] This node won the auction. Executing task...`);
            await executeTask();
        }
    } else {
        console.log("[RESULT] No valid bids found");
    }
}

async function executeTask() {
    try {
        const originalRpcUrl = process.env.OTHENTIC_CLIENT_RPC_ADDRESS; 
        const updatedRpcUrl = new URL(originalRpcUrl);
        updatedRpcUrl.port = "4003"; 

        await axios.post(`http://execution-service:4003/task/execute`, {}, {
            headers: { "Content-Type": "application/json" }
        });
        console.log(`[EXECUTION] Task executed successfully`);
    } catch (error) {
        console.log(`[EXECUTION] Error executing task:`, error);
    }
}

async function publishTask(messageType, taskData) {
    taskData.messageType = messageType;
    const jsonData = JSON.stringify(taskData);
    const rpcUrl = process.env.OTHENTIC_CLIENT_RPC_ADDRESS; // Replace with actual RPC server URL
    const hexData = Buffer.from(jsonData, "utf8").toString("hex");
    const payload = {
        jsonrpc: "2.0",
        method: "sendCustomMessage",
        params: [`0x${hexData}`],
        id: 1,
    };
    await axios.post(rpcUrl, payload);
}

async function handleAuctionStart(msg) {
    if (!msg.auctionId || !msg.startTime) {
        console.log("[Error] Auction ID or Start Time is missing.");
        return;
    }
    const auctionStartTime = msg.startTime;
    console.log(`[Node] Auction ${msg.auctionId} started at ${new Date(auctionStartTime).toISOString()}`);
  
    const myBid = Math.floor(Math.random() * 200);
    await commitBid(nodeAccount.address, myBid);

    // All nodes start reveal phase independently
    setTimeout(() => {
        console.log(`[Node] Reveal phase started.`);
        revealBid(nodeAccount.address);

        // All nodes determine the winner independently
        setTimeout(() => {
            console.log(`[Node] Determining winner...`);
            determineWinner();
        }, auctionStartTime + COMMIT_DURATION + REVEAL_DURATION - Date.now());
    }, auctionStartTime + COMMIT_DURATION - Date.now());
}

router.post("/message", async (req, res) => {

    console.log(`Node started and listening to bid_commit and bid_reveal messageTypes.`);
    const { data } = req.body;
    const jsonData = Buffer.from(data.slice(2), "hex").toString("utf8");
    const parsedData = JSON.parse(jsonData);

    switch (parsedData.messageType) {
        case AUCTION_START:
            await handleAuctionStart(parsedData);
            break;
        case AUCTION_BID_COMMIT:
            if (commitments.has(parsedData.nodeId)) {
                console.log(`[Warn] Node ${parsedData.nodeId} has already committed a bid.`);
                return;
            }
            console.log(`[Commit Received] Node: ${parsedData.nodeId}, Commitment: ${parsedData.commitment}`);
            commitments.set(parsedData.nodeId, { commitment: parsedData.commitment });
            break;
        case AUCTION_BID_REVEAL:
            console.log(`[Reveal Received] Node: ${parsedData.nodeId}, Bid: ${parsedData.bid}, Salt: ${parsedData.salt}`);
            revealedBids.set(parsedData.nodeId, { bid: parsedData.bid, salt: parsedData.salt });
            break;
    }
})

module.exports = router
