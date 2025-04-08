const { ethers } = require("ethers");

/**
 * This file contains shared healthcheck functionalitiy for both performer and operators.
 */

/**
 * sends health check request and also validates it using validateHealthcheckResponse
 */
async function healthcheckOperator(endpoint, blockNumber, blockHash, rpcBaseAddress) {
    let response = null;
    let isValid = false;
    const jsonRpcBody = {
      jsonrpc: "2.0",
      method: "healthcheck",
      params: [blockNumber]
    };
  
    try {
      const provider = new ethers.JsonRpcProvider(rpcBaseAddress);
      response = await provider.send(jsonRpcBody.method, jsonRpcBody.params);
      console.debug("healthcheckOperator: API response:", response);
  
      isValid = await validateHealthcheckResponse(response, { blockHash });
      if (isValid === null) {
        console.error("Error validating healthcheck response");
        return null;
      }
    } catch (error) {
      console.error("Error making API request:", error);
      return { response: null, isValid: false };
    }
    
    return { response, isValid: true };
  }

/**
 * returns whether the healthcheck response indicates of a healthy operator
 */
async function validateHealthcheckResponse(response, { blockHash }) {
  try {
    // 1. Verify that blockhash in response is the blockhash of blocknumber that was sent
    if (response.blockHash !== blockHash) {
      console.error("Block hash does not match response block hash");
      return false;
    }

    // 2. Verify blockhash is indeed signed by address
    const payload = ethers.AbiCoder.defaultAbiCoder().encode(
      ['uint256'],
      [response.blockHash]
    );
    const message = ethers.getBytes(ethers.keccak256(payload));
    const signature = response.signature;
    
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress !== response.address) {
      console.error("Recovered address does not match response address");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating healthcheck response:", error);
    return null;
  }
}

module.exports = {
  healthcheckOperator,
  validateHealthcheckResponse,
}