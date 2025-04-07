// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.20;

import { IAttestationCenter } from "./IAttestationCenter.sol";

interface ILivelinessRegistry {
    event OperatorRegistered(address operator, string endpoint);
    event OperatorUnregistered(address operator);
    event OperatorChangedEndpoint(address operator, string endpoint);
    event OperatorPenalized(address operator);

    function registrations(address operator) external view returns (uint256 operatorIndex, uint256 blockNumber, string memory endpoint);
    function attestationCenter() external view returns (IAttestationCenter);
    function getLivelinessScore(address operator) external view returns (uint256);
    function register(string memory endpoint) external;
    function unregister() external;
    function changeEndpoint(string memory endpoint) external;

    error OperatorInAVS();
    error OperatorNotInAVS();
    error OperatorIsRegistered();
    error OperatorNotRegistered();
    error Unauthorized();
}