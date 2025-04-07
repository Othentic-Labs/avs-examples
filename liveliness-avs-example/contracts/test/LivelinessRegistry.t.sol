// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { Test, console } from "forge-std/Test.sol";
import { CommonBase } from "forge-std/Base.sol";
import { StdCheats } from "forge-std/StdCheats.sol";
import { IAttestationCenter } from "../src/interfaces/IAttestationCenter.sol";
import { IAvsLogic } from "../src/interfaces/IAvsLogic.sol";
import { ExposedLivelinessRegistry } from "test/exposes/ExposedLivelinessRegistry.sol";

contract Shared is CommonBase, StdCheats {
    event OperatorRegistered(address operator, string endpoint);
    event OperatorUnregistered(address operator);
    event OperatorChangedEndpoint(address operator, string endpoint);
    event OperatorPenalized(address operator);

    error OperatorInAVS();
    error OperatorNotInAVS();
    error OperatorIsRegistered();
    error OperatorNotRegistered();
    error Unauthorized();

    uint256 constant internal PENALTY_COST = 1000;

    IAttestationCenter internal ATTESTATION_CENTER = IAttestationCenter(makeAddr("ATTESTATION_CENTER"));
    address internal PERFORMER = makeAddr("PERFORMER");
    address internal OPERATOR = makeAddr("OPERATOR");
    address internal OUTSIDER = makeAddr("OUTSIDER");
    uint256 constant internal OPERATOR_INDEX = 1;
    uint256 constant internal BLOCK_NUMBER = 10;

    ExposedLivelinessRegistry internal registry;

    function _setUp() internal {
        registry = new ExposedLivelinessRegistry(ATTESTATION_CENTER);
    }
}

contract Constructor is Test, Shared {
    function setUp() public {
        _setUp();
    }

    function test_attestationCenter() public view {
        assertEq(address(registry.attestationCenter()), address(ATTESTATION_CENTER));
    }
}

contract Register is Test, Shared {
    function setUp() public {
        _setUp();
    }

    function test_simpleCase_operatorRegistered() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.expectEmit(address(registry));
        emit OperatorRegistered(OPERATOR, "endpoint");
        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        (uint256 operatorIndex, uint256 blockNumber, string memory endpoint) = registry.registrations(OPERATOR);
        assertEq(operatorIndex, OPERATOR_INDEX);
        assertEq(blockNumber, BLOCK_NUMBER);
        assertEq(endpoint, "endpoint");
    }

    function test_unauthorizedOperator_revert() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(0)
        );

        vm.expectRevert(OperatorNotInAVS.selector);
        vm.prank(OPERATOR);
        registry.register("endpoint");
    }

    function test_registerTwice_revert() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        vm.expectRevert(OperatorIsRegistered.selector);
        vm.prank(OPERATOR);
        registry.register("endpoint");
    }
}

contract Unregister is Test, Shared {
    function setUp() public {
        _setUp();
    }

    function test_simpleCase_operatorUnregistered() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(0)
        );

        vm.expectEmit(address(registry));
        emit OperatorUnregistered(OPERATOR);
        vm.prank(OPERATOR);
        registry.unregister();

        (uint256 operatorIndex, uint256 blockNumber, string memory endpoint) = registry.registrations(OPERATOR);
        assertEq(operatorIndex, 0);
        assertEq(blockNumber, 0);
        assertEq(endpoint, "");
    }

    function test_unauthorizedOperator_revert() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(0)
        );

        vm.expectRevert(OperatorNotRegistered.selector);
        vm.prank(OPERATOR);
        registry.unregister();
    }

    function test_stillRegisteredInAVS_revert() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        vm.expectRevert(OperatorInAVS.selector);
        vm.prank(OPERATOR);
        registry.unregister();    
    }
}

contract ChangeEndpoint is Test, Shared {
    function setUp() public {
        _setUp();
    }

    function test_simpleCase_endpointChanged() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        vm.expectEmit(address(registry));
        emit OperatorChangedEndpoint(OPERATOR, "newEndpoint");
        vm.prank(OPERATOR);
        registry.changeEndpoint("newEndpoint");

        (uint256 operatorIndex, uint256 blockNumber, string memory endpoint) = registry.registrations(OPERATOR);
        assertEq(operatorIndex, OPERATOR_INDEX);
        assertEq(blockNumber, BLOCK_NUMBER);
        assertEq(endpoint, "newEndpoint");
    }

    function test_operatorNotRegistered_revert() public {
        vm.expectRevert(OperatorNotRegistered.selector);
        vm.prank(OUTSIDER);
        registry.changeEndpoint("newEndpoint");
    }   
}

contract AfterTaskSubmission is Test, Shared {
    function setUp() public {
        _setUp();
    }

    function test_simpleCase_operatorPenalized() public {
        // register operator
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        bytes memory data = abi.encode(OPERATOR, false);
        IAttestationCenter.TaskInfo memory taskInfo = IAttestationCenter.TaskInfo("", data, PERFORMER, 0);
        uint256[] memory operatorIds = new uint256[](0);
        vm.expectEmit(address(registry));
        emit OperatorPenalized(OPERATOR);
        vm.prank(address(ATTESTATION_CENTER));
        registry.afterTaskSubmission(taskInfo, true, "", [uint256(0), uint256(0)], operatorIds);

        assertEq(registry.getPenalties(OPERATOR), 1);
    }

    function test_notApproved_noPenalty() public {
        // register operator
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        bytes memory data = abi.encode(OPERATOR, true);
        IAttestationCenter.TaskInfo memory taskInfo = IAttestationCenter.TaskInfo("", data, PERFORMER, 0);
        uint256[] memory operatorIds = new uint256[](0);
        vm.prank(address(ATTESTATION_CENTER));
        registry.afterTaskSubmission(taskInfo, false, "", [uint256(0), uint256(0)], operatorIds);

        assertEq(registry.getPenalties(OPERATOR), 0);
    }

    function test_notInvalid_noPenalty() public {
        // register operator
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        bytes memory data = abi.encode(OPERATOR, true);
        IAttestationCenter.TaskInfo memory taskInfo = IAttestationCenter.TaskInfo("", data, PERFORMER, 0);
        uint256[] memory operatorIds = new uint256[](0);
        vm.prank(address(ATTESTATION_CENTER));
        registry.afterTaskSubmission(taskInfo, true, "", [uint256(0), uint256(0)], operatorIds);

        assertEq(registry.getPenalties(OPERATOR), 0);
    }

    function test_notAttestationCenter_revert() public {
        IAttestationCenter.TaskInfo memory taskInfo = IAttestationCenter.TaskInfo("", "", OPERATOR, 0);
        uint256[] memory operatorIds = new uint256[](0);
        vm.expectRevert(Unauthorized.selector);
        vm.prank(OUTSIDER);
        registry.afterTaskSubmission(taskInfo, true, "", [uint256(0), uint256(0)], operatorIds);
    }
}

contract GetLivelinessScore is Test, Shared {
    function setUp() public {
        _setUp();
    }

    function test_simpleCase_returnsScore() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        vm.roll(BLOCK_NUMBER + 1234);
        uint256 livelinessScore = registry.getLivelinessScore(OPERATOR);
        assertEq(livelinessScore, 1234);
    }

    function test_twoPenalties_returnsScore() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        // use of helper function from exposed
        registry.setOperatorPenalites(OPERATOR, 2);

        vm.roll(BLOCK_NUMBER + 20_000);
        uint256 livelinessScore = registry.getLivelinessScore(OPERATOR);
        assertEq(livelinessScore, 20_000 - 2 * PENALTY_COST);  
    }

    function test_penaltyGreaterThanBlocksSinceRegistration_returnsZero() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(OPERATOR_INDEX)
        );

        vm.roll(BLOCK_NUMBER);
        vm.prank(OPERATOR);
        registry.register("endpoint");

        // use of helper function from exposed
        registry.setOperatorPenalites(OPERATOR, 1);

        vm.roll(BLOCK_NUMBER + 100);
        uint256 livelinessScore = registry.getLivelinessScore(OPERATOR);
        assertEq(livelinessScore, 0);
    }

    function test_operatorNotRegistered_revert() public {
        vm.mockCall(
            address(ATTESTATION_CENTER), 
            abi.encodeWithSelector(ATTESTATION_CENTER.operatorsIdsByAddress.selector, OPERATOR),
            abi.encode(0)
        );

        vm.expectRevert(OperatorNotRegistered.selector);
        registry.getLivelinessScore(OUTSIDER);
    }
}