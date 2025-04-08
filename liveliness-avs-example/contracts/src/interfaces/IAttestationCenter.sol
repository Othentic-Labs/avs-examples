// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.20;

interface IAttestationCenter {
    struct TaskInfo {
        string proofOfTask;
        bytes data;
        address taskPerformer;
        uint16 taskDefinitionId;
    }

    function setAvsLogic(address _avsLogic) external;
    function avsLogic() external view returns (address);
    function operatorsIdsByAddress(address _operator) external view returns (uint256);
}