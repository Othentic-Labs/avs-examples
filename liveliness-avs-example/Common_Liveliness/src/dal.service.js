const { ethers } = require("ethers");

const ATTESTATION_CENTER_ABI = [
    'function getOperatorPaymentDetail(uint) public view returns (address, uint, uint, uint8)',
    'function numOfOperators() public view returns (uint)',
    'function avsLogic() public view returns (address)',
];

const LIVELINESS_REGISTRY_ABI = [
    'function registrations(address) external view returns (uint256, uint256, string)',
];

async function getOperatorsLength(blockNumber, { attestationCenterAddress, provider }) {
    const attestationCenterContract = new ethers.Contract(attestationCenterAddress, ATTESTATION_CENTER_ABI, provider);
    return await attestationCenterContract.numOfOperators({ blockTag: blockNumber });
}

async function getOperator(operatorIndex, blockNumber, { attestationCenterAddress, provider } ) {
    const attestationCenterContract = new ethers.Contract(attestationCenterAddress, ATTESTATION_CENTER_ABI, provider);
    const [operatorAddress,] = await attestationCenterContract.getOperatorPaymentDetail(operatorIndex, { blockTag: blockNumber });
    const avsLogicAddress = await attestationCenterContract.avsLogic({ blockTag: blockNumber });
    const avsLogic = new ethers.Contract(avsLogicAddress, LIVELINESS_REGISTRY_ABI, provider);
    const [,,endpoint] = await avsLogic.registrations(operatorAddress, { blockTag: blockNumber });

    return { operatorAddress, endpoint };
}

async function getChosenOperator(blockHash, blockNumber, { attestationCenterAddress, provider }) {
    const operatorsLength = await getOperatorsLength(blockNumber, { attestationCenterAddress, provider });
    // NOTE: there is slight modulo bias but assumes number of operators is small enough it doesn't matter
    // NOTE: maybe should use RANDAO instead of blockhash since miner can manipulate blockhash
    const chosenOperatorIndex = (BigInt(blockHash) % BigInt(operatorsLength)) + 1n;
    return await getOperator(chosenOperatorIndex, blockNumber, { attestationCenterAddress, provider });
}

module.exports = {
    getOperatorsLength,
    getOperator,
    getChosenOperator,
}