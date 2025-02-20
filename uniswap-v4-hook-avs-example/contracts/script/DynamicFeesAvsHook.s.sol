// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.20;

/*______     __      __                              __      __ 
 /      \   /  |    /  |                            /  |    /  |
/$$$$$$  | _$$ |_   $$ |____    ______   _______   _$$ |_   $$/   _______ 
$$ |  $$ |/ $$   |  $$      \  /      \ /       \ / $$   |  /  | /       |
$$ |  $$ |$$$$$$/   $$$$$$$  |/$$$$$$  |$$$$$$$  |$$$$$$/   $$ |/$$$$$$$/ 
$$ |  $$ |  $$ | __ $$ |  $$ |$$    $$ |$$ |  $$ |  $$ | __ $$ |$$ |
$$ \__$$ |  $$ |/  |$$ |  $$ |$$$$$$$$/ $$ |  $$ |  $$ |/  |$$ |$$ \_____ 
$$    $$/   $$  $$/ $$ |  $$ |$$       |$$ |  $$ |  $$  $$/ $$ |$$       |
 $$$$$$/     $$$$/  $$/   $$/  $$$$$$$/ $$/   $$/    $$$$/  $$/  $$$$$$$/
*/
/**
 * @author Othentic Labs LTD.
 * @notice Terms of Service: https://www.othentic.xyz/terms-of-service
 */
import {Script, console} from "forge-std/Script.sol";
import {IAttestationCenter} from "../src/interfaces/IAttestationCenter.sol";
import {DynamicFeesAvsHook} from "../src/DynamicFeesAvsHook.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";

// How to:
// Either `source ../../.env` or replace variables in command.
// forge script DynamicFeesAvsHookDeploy --rpc-url $L2_RPC --private-key $PRIVATE_KEY
// --broadcast -vvvv --verify --etherscan-api-key $L2_ETHERSCAN_API_KEY --chain
// $L2_CHAIN --verifier-url $L2_VERIFIER_URL --sig="run(address,address)" $ATTESTATION_CENTER_ADDRESS $POOL_MANAGER_ADDRESS
contract DynamicFeesAvsHookDeploy is Script {
    function setUp() public {}

    function run(address attestationCenter, address poolManager) public {
        vm.startBroadcast();
        DynamicFeesAvsHook avsHook = new DynamicFeesAvsHook(attestationCenter, IPoolManager(poolManager));
        IAttestationCenter(attestationCenter).setAvsLogic(address(avsHook));
    }
}
