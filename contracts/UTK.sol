// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UniversalToken
 * @dev An ERC20 token whose minting and burning is controlled by ridge
 */
contract UniversalToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol, address initialOwner) ERC20(name, symbol) Ownable(initialOwner) {}

    /**
     * @notice Creates new tokens and assigns them to an account
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Burns tokens from a specific account.
     * @dev The Bridge needs to have an allowance from account.
     */
    function burnFrom(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}