// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
// Add this line below
import "forge-std/console.sol";
import {Bingo} from "../src/Bingo.sol";
import {MockERC20} from "../src/MockERC20.sol";

contract DeployBingo is Script {
    function run() external returns (Bingo, MockERC20) {
        // ... rest of your script is correct
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        MockERC20 mockToken = new MockERC20();
        console.log("MockERC20 deployed at:", address(mockToken));

        Bingo bingo = new Bingo(address(mockToken));
        console.log("Bingo contract deployed at:", address(bingo));

        vm.stopBroadcast();

        return (bingo, mockToken);
    }
}