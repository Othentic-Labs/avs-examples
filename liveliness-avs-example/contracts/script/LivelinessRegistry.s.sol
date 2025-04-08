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
import { IAttestationCenter } from "../src/interfaces/IAttestationCenter.sol";
import { IAvsLogic } from "../src/interfaces/IAvsLogic.sol";
import { LivelinessRegistry } from '../src/LivelinessRegistry.sol';

// How to:
// Either `source ../../.env` or replace variables in command.
// forge script LivelinessRegistryDeploy --rpc-url $L2_RPC --private-key $PRIVATE_KEY
// --broadcast -vvvv --verify --etherscan-api-key $L2_ETHERSCAN_API_KEY --chain
// $L2_CHAIN --verifier-url $L2_VERIFIER_URL --sig="run(address)" $ATTESTATION_CENTER_ADDRESS
contract LivelinessRegistryDeploy is Script {
    function setUp() public {}

    function run(address attestationCenter) public {
        vm.startBroadcast();
        console.log("me: ", msg.sender);
        LivelinessRegistry livelinessRegistry = new LivelinessRegistry(IAttestationCenter(attestationCenter));
        IAttestationCenter(attestationCenter).setAvsLogic(address(livelinessRegistry));
    }
}
