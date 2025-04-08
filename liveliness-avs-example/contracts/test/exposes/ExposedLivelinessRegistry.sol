// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.20;

import { IAttestationCenter } from "../../src/interfaces/IAttestationCenter.sol";
import { LivelinessRegistry } from "src/LivelinessRegistry.sol";

contract ExposedLivelinessRegistry is LivelinessRegistry {
    constructor(IAttestationCenter _attestationCenter) LivelinessRegistry(_attestationCenter) {}

    function getPenalties(address _operator) external view returns (uint256) {
        return penalties[_operator];
    }

    // Helper function for tests
    // can't mock the counts of penalites in tests because it's an internal variable and
    // not a function call
    //
    // Also storage cheats are annoying and unmaintainable
    function setOperatorPenalites(address _operator, uint256 _penalties) external {
        penalties[_operator] = _penalties;
    }
}