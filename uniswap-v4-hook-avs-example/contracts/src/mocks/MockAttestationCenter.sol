// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.24;

import {IAttestationCenter} from "../interfaces/IAttestationCenter.sol";
import {IAvsLogic} from "../interfaces/IAvsLogic.sol";

contract MockAttestationCenter is IAttestationCenter {
    IAvsLogic public avsLogic;

    function setAvsLogic(address _avsLogic) external {
        avsLogic = IAvsLogic(_avsLogic);
    }

    function submitTask(uint24 fee) external {
        IAttestationCenter.TaskInfo memory taskInfo = IAttestationCenter.TaskInfo({
            proofOfTask: "mock_proof",
            data: abi.encode(fee),
            taskPerformer: address(this),
            taskDefinitionId: 1
        });

        avsLogic.afterTaskSubmission(taskInfo, true, "", [uint256(0), uint256(0)], new uint256[](0));
    }
}
