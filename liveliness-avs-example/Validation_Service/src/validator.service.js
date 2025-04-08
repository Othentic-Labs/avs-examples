require('dotenv').config();
const  dalService = require('./dal.service');
const healthcheckService = require("./liveliness/healthcheck.service");
const { ethers } = require('ethers');

// Instead of a task each block, the task happens every EPOCH of blocks.
// checked block must be last block that is divisible by epoch period
const EPOCH = 10;

let l2Rpc;
let attestationCenterAddress;
let rpcBaseAddress

function init() {
  l2Rpc = process.env.L2_RPC;
  attestationCenterAddress = process.env.ATTESTATION_CENTER_ADDRESS;
  rpcBaseAddress = process.env.OTHENTIC_CLIENT_RPC_ADDRESS;
}

/**
 * return true if task was performed correctly, false otherwise
 */
async function validate(proofOfTask, data) {
  const l2Provider = new ethers.JsonRpcProvider(l2Rpc);
  const latestBlocknumber = await l2Provider.getBlockNumber();
  const taskResult = await dalService.getIPfsTask(proofOfTask);

  if (taskResult === null) {
    console.log("Task not found in IPFS");
    return false;
  }
  
  const { blockHash, chosenOperator, response, isValid } = taskResult;
  const getBlockByHashRequest = {
    jsonrpc: "2.0",
    method: "eth_getBlockByHash",
    params: [blockHash, false]
  };
  const block = await l2Provider.send(getBlockByHashRequest.method, getBlockByHashRequest.params);
  // ethers getBlock doesn't work with blockhash so need to use specific RPC method,
  // but number is returned as hexstring, unlinke in getBlock method which returns as number
  const blockNumber = parseInt(block.number, 16);
  const targetBlocknumber = latestBlocknumber - (latestBlocknumber % EPOCH);
  if (blockNumber < targetBlocknumber) {
    console.log("Task blockNumber is stale");
    return false;
  } else if (blockNumber > targetBlocknumber) {
    console.log("Task blockNumber must be last blockNumber divisible by epoch period");
    return false;
  }
  
  const chosenOperatorCheck = await dalService.getChosenOperator(blockHash, blockNumber, {
    attestationCenterAddress, 
    provider: l2Provider
  });

  console.debug("chosenOperator comparison: ", { chosenOperator, chosenOperatorCheck });
  if (chosenOperator.operatorAddress !== chosenOperatorCheck.operatorAddress || chosenOperator.endpoint !== chosenOperatorCheck.endpoint) {
    console.log("Chosen operator is different from chosen operator in task");
    return false;
  }

  // data is chosenOperator.operatorAddress in order to read on-chain
  const dataCheck = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "bool"],
    [chosenOperator.operatorAddress, isValid]
  );

  console.debug("data comparison: ", { data, dataCheck })
  if (data !== dataCheck) {
    console.log("Data field is different from chosen operator address");
    return false;
  }

  if (isValid) {
    console.debug("isValid is true, validating response with: ", { response, blockHash });
    const isValidCheck = await healthcheckService.validateHealthcheckResponse(response, { blockHash });
    if (!isValidCheck) {
      console.log("Response is invalid");
      return false;
    }
    
    const isChosenOperatorCorrect = chosenOperator.operatorAddress === response.address;
    console.debug("chosen operator check: ", { isChosenOperatorCorrect, chosenOperator, response });
    if (!isChosenOperatorCorrect) {
      console.log("Chosen operator is incorrect");
      return false;
    }
  } else {
    console.debug("isValid is false, performing healthcheck on operator: ", { chosenOperator, blockNumber, blockHash});
    const { isValid: isValidCheck } = await healthcheckService.healthcheckOperator(chosenOperator.endpoint, blockNumber, blockHash, rpcBaseAddress);
    if (isValidCheck === null) {
      throw new Error("Error performing healthcheck on operator: ", chosenOperator);
    }
    
    if (isValidCheck) {
      console.log("Healthcheck is valid");
      return false;
    }
  }

  return true;
}

module.exports = {
  init,
  validate,
}