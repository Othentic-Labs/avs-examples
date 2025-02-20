// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.24;

interface IAttestationCenter {
    struct TaskInfo {
        string proofOfTask;
        bytes data;
        address taskPerformer;
        uint16 taskDefinitionId;
    }

    function setAvsLogic(address _avsLogic) external;
}
