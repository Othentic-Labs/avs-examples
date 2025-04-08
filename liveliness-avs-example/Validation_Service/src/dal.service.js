require('dotenv').config();
const axios = require("axios");
const dalService = require('./liveliness/dal.service');
let ipfsHost='';
let l2Rpc='';

function init() {
  ipfsHost = process.env.IPFS_HOST;
  l2Rpc = process.env.L2_RPC;
}

async function getIPfsTask(cid) {
  try {
    const { data } = await axios.get(ipfsHost + cid);
    return {
      blockHash: data.blockHash,
      chosenOperator: data.chosenOperator,
      response: data.response,
      isValid: data.isValid,
    };
  } catch (e) {
    console.error("could not read task from IPFS", e);
    return null;
  }
}  
  
module.exports = {
  init,
  getIPfsTask,
  ...dalService
}