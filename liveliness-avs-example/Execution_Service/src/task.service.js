"use strict";
require('dotenv').config();

const { ethers } = require("ethers");
const dalService = require("./dal.service");
const healthcheckService = require("./healthcheck.service");

const EPOCH = 10;
const RETRIES = 1;
const RETRY_DELAY = 1000;

let l2Rpc;

function init() {
  l2Rpc = process.env.L2_RPC;
}

function performTaskOnEpoch() {
  const l2Provider = new ethers.JsonRpcProvider(l2Rpc);
  l2Provider.on("block", async (blockNumber) => {
    if (blockNumber % EPOCH !== 0) {
      return;
    }

    console.log(`performing task for block number: ${blockNumber}`);

    const block = await l2Provider.getBlock(blockNumber);
    await performHealthcheckTask(block)
  });
}

async function performHealthcheckTask(block) {
  try {
    var taskDefinitionId = 0;
    console.log(`taskDefinitionId: ${taskDefinitionId}`);
    
    let isValid = false;
    let tries = 0;
    let healthcheckTask = null;
    while (!isValid && tries < RETRIES) {
      if (tries > 0) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
      
      console.log(`Performing healthcheck task, attempt ${tries + 1}`);
      healthcheckTask = await healthcheckService.performHealthcheck(block);
      if (!healthcheckTask) {
        throw new Error("Healthcheck failed");
      }
      
      isValid = healthcheckTask.isValid;
      tries++;
    }
    
    const cid = await dalService.publishJSONToIpfs(healthcheckTask);
    const data = ethers.AbiCoder.defaultAbiCoder().encode( 
      ["address", "bool"],
      [healthcheckTask.chosenOperator.operatorAddress, healthcheckTask.isValid]
    );
    
    await dalService.sendTask(cid, data, taskDefinitionId);
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  init,
  performTaskOnEpoch,
};
