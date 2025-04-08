const { ethers } = require("ethers");

const ATTESTATION_CENTER_ABI = [
    'function getOperatorPaymentDetail(uint) public view returns (address, uint, uint, uint8)',
    'function numOfOperators() public view returns (uint)',
    'function avsLogic() public view returns (address)',
    `function getActiveOperatorsDetails() view returns (tuple(address operator, uint256 operatorId, uint256 votingPower)[])`
    
];

const LIVELINESS_REGISTRY_ABI = [
    'function registrations(address) external view returns (uint256, uint256, string)',
];

async function getOperatorsLength(blockNumber, { attestationCenterAddress, provider }) {
    const attestationCenterContract = new ethers.Contract(attestationCenterAddress, ATTESTATION_CENTER_ABI, provider);
    return await attestationCenterContract.numOfOperators({ blockTag: blockNumber });
}

async function getActiveOperators(blockNumber, { attestationCenterAddress, provider }) {
    const attestationCenterContract = new ethers.Contract(attestationCenterAddress, ATTESTATION_CENTER_ABI, provider);
    return await attestationCenterContract.getActiveOperatorsDetails({ blockTag: blockNumber });
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
    const operators = await getActiveOperators(blockNumber ,{ attestationCenterAddress, provider });
    const numOfActiveOperators = BigInt(operators.length);
    const selectedIndex = BigInt(blockNumber) % numOfActiveOperators;
    return await getOperator(selectedIndex, blockNumber, { attestationCenterAddress, provider });
}

module.exports = {
    getOperatorsLength,
    getOperator,
    getChosenOperator,
}