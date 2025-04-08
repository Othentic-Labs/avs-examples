// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.20;

import { IAttestationCenter } from "./interfaces/IAttestationCenter.sol";
import { IAvsLogic } from "./interfaces/IAvsLogic.sol";
import { ILivelinessRegistry } from "./interfaces/ILivelinessRegistry.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract LivelinessRegistry is ILivelinessRegistry, IAvsLogic {
    // can operator indicies change? (e.g. unregistration from AVS)
    struct Registration {
        uint256 operatorIndex;
        uint256 blockNumber;
        string endpoint;
    }

    uint256 constant private PENALTY_COST = 1000;

    mapping(address => Registration) public registrations;
    mapping(address => uint256) internal penalties;
    IAttestationCenter public attestationCenter;

    constructor(IAttestationCenter _attestationCenter) {
        attestationCenter = _attestationCenter;
    }

    modifier registeredOperator(address _operator) {
        Registration memory registration = registrations[_operator];
        if (registration.operatorIndex == 0) {
            revert OperatorNotRegistered();
        }

        _;
    }

    modifier unregisteredOperator(address _operator) {
        Registration memory registration = registrations[_operator];
        if (registration.operatorIndex != 0) {
            revert OperatorIsRegistered();
        }

        _;
    }

    modifier onlyAvsOperator() {
        uint256 operatorIndex = attestationCenter.operatorsIdsByAddress(msg.sender);
        if (operatorIndex == 0) {
            revert OperatorNotInAVS();
        }
        _;
    }

    modifier onlyAttestationCenter() {
        if (msg.sender != address(attestationCenter)) {
            revert Unauthorized();
        }
        _;
    }

    // need to put more thought into how liveliness scores are calculated.
    // for now = blocksSinceRegistration - C * penalites, where C is a constant representing the price of penalites
    // potential ideas is to incorporate the stake of the operator in the calculation and also how recent were the penalites
    function getLivelinessScore(address _operator) external view registeredOperator(_operator) returns (uint256) {
        Registration memory registration = registrations[_operator];
        uint256 blocksSinceRegistration = block.number - registration.blockNumber;
        uint256 penaltyBlocks = penalties[_operator] * PENALTY_COST;

        if (penaltyBlocks > blocksSinceRegistration) {
            return 0;
        } else {
            return blocksSinceRegistration - penaltyBlocks;
        }
    }

    function register(string memory _endpoint) external unregisteredOperator(msg.sender) onlyAvsOperator() {
        uint256 operatorIndex = attestationCenter.operatorsIdsByAddress(msg.sender);
        registrations[msg.sender] = Registration(operatorIndex, block.number, _endpoint);

        emit OperatorRegistered(msg.sender, _endpoint);
    }

    // in order to unregister you need to also be unregisterd from AVS 
    function unregister() external registeredOperator(msg.sender) {
        uint256 operatorIndex = attestationCenter.operatorsIdsByAddress(msg.sender);
        if (operatorIndex != 0) {
            revert OperatorInAVS();
        }

        // NOTE: Might make sense to simply switch a flag in order to save gas
        delete registrations[msg.sender];
        emit OperatorUnregistered(msg.sender);
    }

    function changeEndpoint(string memory _endpoint) external registeredOperator(msg.sender) {
        registrations[msg.sender].endpoint = _endpoint;
        emit OperatorChangedEndpoint(msg.sender, _endpoint);
    }

    function afterTaskSubmission(
        IAttestationCenter.TaskInfo calldata _taskInfo, 
        bool _isApproved, 
        bytes calldata /* _tpSignature */, 
        uint256[2] calldata /* _taSignature */, 
        uint256[] calldata /* _operatorIds */
    ) external onlyAttestationCenter() {
        (address operator, bool isValid) = abi.decode(_taskInfo.data, (address, bool));

        if (_isApproved && !isValid) {
            penalties[operator]++;
            emit OperatorPenalized(operator);
        }
    }

    function beforeTaskSubmission(
        IAttestationCenter.TaskInfo calldata /* _taskInfo */, 
        bool /* _isApproved */, 
        bytes calldata /* _tpSignature */, 
        uint256[2] calldata /* _taSignature */, 
        uint256[] calldata /* _operatorIds */
    ) external {
        // no implementation
    }
}