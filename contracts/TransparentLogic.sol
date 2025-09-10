// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./OwnableUpgradeable.sol"; 

/**
 * @title TransparentTokenV1
 * @notice Logic V1 for the Transparent Proxy 
 */
contract TransparentTokenV1 is ERC20Upgradeable, CustomOwnableUpgradeable {
    function initialize(string memory name, string memory symbol) public initializer {
        __ERC20_init(name, symbol);
        __Ownable_init(); 
        _mint(msg.sender, 1_000_000 * (10**decimals()));
    }

    function version() public pure returns (string memory) {
        return "Transparent V1 (Hybrid)";
    }
}

/**
 * @title TransparentTokenV2
 * @notice Logic V2, adds a burn function.
 */
contract TransparentTokenV2 is ERC20Upgradeable, CustomOwnableUpgradeable {
    function version() public pure returns (string memory) {
        return "Transparent V2 (Hybrid)";
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}



