// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/utils/BaseHook.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/src/types/BeforeSwapDelta.sol";
import {IAvsLogic} from "./interfaces/IAvsLogic.sol";
import {IAttestationCenter} from "./interfaces/IAttestationCenter.sol";
import {console} from "forge-std/console.sol";

contract DynamicFeesAvsHook is IAvsLogic, BaseHook {
    address public immutable ATTESTATION_CENTER;
    uint24 public fee = 3000;

    event FeeUpdated(uint24 indexed fee);

    error OnlyAttestationCenter();

    constructor(address _attestationCenterAddress, IPoolManager _poolManager) BaseHook(_poolManager) {
        ATTESTATION_CENTER = _attestationCenterAddress;
    }

    function afterTaskSubmission(
        IAttestationCenter.TaskInfo calldata _taskInfo,
        bool _isApproved,
        bytes calldata, /* _tpSignature */
        uint256[2] calldata, /* _taSignature */
        uint256[] calldata /* _operatorIds */
    ) external {
        if (msg.sender != address(ATTESTATION_CENTER)) revert OnlyAttestationCenter();
        uint24 _fee = abi.decode(_taskInfo.data, (uint24));

        if (_isApproved) {
            fee = _fee;
            emit FeeUpdated(_fee);
        }
    }

    function beforeTaskSubmission(
        IAttestationCenter.TaskInfo calldata _taskInfo,
        bool _isApproved,
        bytes calldata _tpSignature,
        uint256[2] calldata _taSignature,
        uint256[] calldata _attestersIds
    ) external {}

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: true,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function _beforeSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata, bytes calldata)
        internal
        virtual
        override
        onlyPoolManager
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        poolManager.updateDynamicLPFee(key, fee);
        return (BaseHook.beforeSwap.selector, BeforeSwapDelta.wrap(0), fee);
    }

    function _afterInitialize(address, PoolKey calldata key, uint160, int24)
        internal
        virtual
        override
        onlyPoolManager
        returns (bytes4)
    {
        uint24 INITIAL_FEE = 3000; // 0.3%
        poolManager.updateDynamicLPFee(key, INITIAL_FEE);
        return BaseHook.afterInitialize.selector;
    }
}
