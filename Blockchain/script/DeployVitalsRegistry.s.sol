// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {VitalsRegistry} from "../src/VitalsRegistry.sol";

contract DeployVitalsRegistry is Script {
    function run() external {

        vm.startBroadcast();
        VitalsRegistry deployed = new VitalsRegistry();
        vm.stopBroadcast();
    }
}
