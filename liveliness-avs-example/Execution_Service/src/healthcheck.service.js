require('dotenv').config();

const { ethers } = require('ethers');
const dalService = require('./dal.service');
const { healthcheckService } = require('common_liveliness');

let rpcBaseAddress='';
let l2Rpc='';
let attestationCenterAddress='';

function init() {
  rpcBaseAddress = process.env.OTHENTIC_CLIENT_RPC_ADDRESS;
  l2Rpc = process.env.L2_RPC;
  attestationCenterAddress = process.env.ATTESTATION_CENTER_ADDRESS;
}

async function performHealthcheck(block) {
  const l2Provider = new ethers.JsonRpcProvider(l2Rpc);
  const blockNumber = block.number;
  const blockHash = block.hash;
  
  const chosenOperator = await dalService.getChosenOperator(
    blockHash,
    blockNumber,
    {
      attestationCenterAddress, 
      provider: l2Provider
    }
  );

  const healthcheckResult = await healthcheckService.healthcheckOperator(chosenOperator.endpoint, blockNumber, blockHash);
  if (healthcheckResult === null) {
    throw new Error("Error performing healthcheck");
  }

  let { response, isValid } = healthcheckResult;

  const task = {
    blockHash,
    chosenOperator,
    response,
    isValid,
  }

  return task;
}

module.exports = {
  init,
  performHealthcheck,
}