"use strict";
const { Router } = require("express");
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const oracleService = require("./oracle.service");
const dalService = require("./dal.service");
const axios = require("axios");

const router = Router();
const AUCTION_START = "auction/start";

router.post("/execute", async (req, res) => {
    console.log("Executing task");

    try {
        var taskDefinitionId = Number(req.body.taskDefinitionId) || 0;
        console.log(`taskDefinitionId: ${taskDefinitionId}`);

        const result = await oracleService.getPrice("ETHUSDT");
        result.price = req.body.fakePrice || result.price;
        const cid = await dalService.publishJSONToIpfs(result);
        const data = "hello";
        await dalService.sendTask(cid, data, taskDefinitionId);
        return res.status(200).send(new CustomResponse({proofOfTask: cid, data: data, taskDefinitionId: taskDefinitionId}, "Task executed successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})

router.post("/elect", async (req, res) => {
    try {
        await publishTask(AUCTION_START, { auctionId: 12, startTime: Date.now() });
        return res.status(200).send(new CustomResponse({ auctionId: 12 }, "Task executed successfully"));
    } catch (error) {
        console.log(error);
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
});

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

module.exports = router;
