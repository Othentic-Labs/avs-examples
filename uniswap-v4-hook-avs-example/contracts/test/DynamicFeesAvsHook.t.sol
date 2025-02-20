// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {IAttestationCenter} from "../src/interfaces/IAttestationCenter.sol";
import {DynamicFeesAvsHook} from "../src/DynamicFeesAvsHook.sol";
import {MockAttestationCenter} from "../src/mocks/MockAttestationCenter.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {Deployers} from "v4-core/test/utils/Deployers.sol";
import {HookMiner} from "v4-periphery/src/utils/HookMiner.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {LPFeeLibrary} from "v4-core/src/libraries/LPFeeLibrary.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId} from "v4-core/src/types/PoolId.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {StateLibrary} from "v4-core/src/libraries/StateLibrary.sol";
import {Currency, CurrencyLibrary} from "v4-core/src/types/Currency.sol";

contract DynamicAvsFeesAvsHookTest is Test, Deployers {
    using StateLibrary for IPoolManager;

    DynamicFeesAvsHook avsHook;
    MockAttestationCenter attestationCenter;

    function setUp() external {
        deployFreshManagerAndRouters();
        deployMintAndApprove2Currencies();
        attestationCenter = new MockAttestationCenter();

        uint160 flags = uint160(Hooks.AFTER_INITIALIZE_FLAG | Hooks.BEFORE_SWAP_FLAG);
        bytes memory constructorArgs = abi.encode(address(attestationCenter), IPoolManager(address(manager)));
        (address hookAddress, bytes32 salt) =
            HookMiner.find(address(this), flags, type(DynamicFeesAvsHook).creationCode, constructorArgs);

        avsHook = new DynamicFeesAvsHook{salt: salt}(address(attestationCenter), IPoolManager(address(manager)));
        require(address(avsHook) == hookAddress, "DynamicFeesAvsHook: hook address mismatch");

        attestationCenter.setAvsLogic(address(avsHook));

        (key,) = initPoolAndAddLiquidity(
            currency0, currency1, IHooks(address(avsHook)), LPFeeLibrary.DYNAMIC_FEE_FLAG, SQRT_PRICE_1_1
        );
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                      INITIALIZATION TESTS                  */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    function test_initialState() external view {
        assertEq(avsHook.ATTESTATION_CENTER(), address(attestationCenter), "Invalid attestation center address");
        assertEq(avsHook.fee(), 3000, "Initial fee should be 0.3%");
        assertEq(_fetchPoolLPFee(key), 3000, "Initial fee should be 0.3%");
    }

    function test_getHookPermissions() external view {
        Hooks.Permissions memory permissions = avsHook.getHookPermissions();

        assertTrue(permissions.afterInitialize, "afterInitialize should be enabled");
        assertTrue(permissions.beforeSwap, "beforeSwap should be enabled");

        assertFalse(permissions.beforeInitialize, "beforeInitialize should be disabled");
        assertFalse(permissions.afterSwap, "afterSwap should be disabled");
        assertFalse(permissions.beforeAddLiquidity, "beforeAddLiquidity should be disabled");
        assertFalse(permissions.afterAddLiquidity, "afterAddLiquidity should be disabled");
        assertFalse(permissions.beforeRemoveLiquidity, "beforeRemoveLiquidity should be disabled");
        assertFalse(permissions.afterRemoveLiquidity, "afterRemoveLiquidity should be disabled");
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                     AFTER INITIALIZE TESTS                 */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    function test_afterInitialize_setsDynamicFee() public {
        (Currency testCurrency0, Currency testCurrency1) = deployAndMint2Currencies();

        (PoolKey memory newKey,) = initPool(
            testCurrency0, testCurrency1, IHooks(address(avsHook)), LPFeeLibrary.DYNAMIC_FEE_FLAG, SQRT_PRICE_1_1
        );

        assertEq(_fetchPoolLPFee(newKey), 3000, "Initial fee should be 0.3%");
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*:*/
    /*                    TASK SUBMISSION TESTS                     */
    /*.•°:°.´+˚.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/

    function test_afterTaskSubmission_onlyAttestationCenter() public {
        uint24 newFee = 500; // 0.05%
        vm.expectRevert(DynamicFeesAvsHook.OnlyAttestationCenter.selector);

        vm.prank(address(1)); // Random address
        avsHook.afterTaskSubmission(
            IAttestationCenter.TaskInfo({
                proofOfTask: "mock_proof",
                data: abi.encode(newFee),
                taskPerformer: address(this),
                taskDefinitionId: 1
            }),
            true,
            "",
            [uint256(0), uint256(0)],
            new uint256[](0)
        );
    }

    function test_afterTaskSubmission_updatesFeeWhenApproved() public {
        uint24 newFee = 500; // 0.05%

        vm.expectEmit(true, true, true, true, address(avsHook));
        emit DynamicFeesAvsHook.FeeUpdated(newFee);

        attestationCenter.submitTask(newFee);
        assertEq(avsHook.fee(), newFee, "Fee should be updated");
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*:*/
    /*                        SWAP TESTS                            */
    /*.•°:°.´+˚.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/

    function test_beforeSwap_updatesDynamicFee() public {
        uint24 newFee = 500; // 0.05%
        attestationCenter.submitTask(newFee);

        PoolSwapTest.TestSettings memory testSettings =
            PoolSwapTest.TestSettings({takeClaims: false, settleUsingBurn: false});

        swapRouter.swap(key, SWAP_PARAMS, testSettings, ZERO_BYTES);
        assertEq(_fetchPoolLPFee(key), newFee, "Pool fee should be updated before swap");
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                      HELPER FUNCTIONS                      */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    function _fetchPoolLPFee(PoolKey memory _key) internal view returns (uint256 lpFee) {
        PoolId id = _key.toId();
        (,,, lpFee) = manager.getSlot0(id);
    }
}
