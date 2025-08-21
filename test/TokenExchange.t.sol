// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
// Make sure the path to your contract file is correct
import {Coins, Assets} from "../src/TokenExchange.sol";

contract ExchangeTest is Test {
    Coins public coins;
    Assets public assets;

    // Create simulated addresses for the test participants
    address public contractDeployer;
    address public assetOwner = makeAddr("assetOwner");
    address public buyer = makeAddr("buyer");

    /**
     * @notice This function runs before each test to set up the environment.
     */
    function setUp() public {
        // The test contract itself deploys the Coins contract, so `address(this)` is the owner.
        contractDeployer = address(this);
        
        coins = new Coins();
        assets = new Assets(address(coins));

        // Give the buyer some coins to use for the purchase.
        // Since `address(this)` is the owner of the Coins contract, it can call ownerMint.
        coins.ownerMint(buyer, 500 ether);
    }

    /**
     * @notice Tests the successful exchange of an Asset for Coins.
     */
    function test_Exchange_Success() public {
        // --- Arrange ---
        uint256 assetId = 0;
        uint256 price = 100 ether;

        // 1. The assetOwner mints a new asset (NFT).
        vm.prank(assetOwner);
        assets.mint();
        assertEq(assets.ownerOf(assetId), assetOwner, "Asset owner should be correct after minting");

        // 2. The assetOwner sets a price for the newly minted asset.
        vm.prank(assetOwner);
        assets.setPrice(assetId, price);
        assertEq(assets.assetPrices(assetId), price, "Price was not set correctly");

        // 3. The buyer approves the Assets contract to spend their Coins for the purchase.
        vm.prank(buyer);
        coins.approve(address(assets), price);
        assertEq(coins.allowance(buyer, address(assets)), price, "Allowance was not set correctly");

        // Store initial balances to check them later.
        uint256 buyerInitialBalance = coins.balanceOf(buyer);
        uint256 ownerInitialBalance = coins.balanceOf(assetOwner);

        // --- Act ---
        // 4. The buyer executes the exchange.
        vm.prank(buyer);
        assets.exchange(assetId);

        // --- Assert ---
        // Check that the ownership of the asset has transferred to the buyer.
        assertEq(assets.ownerOf(assetId), buyer, "Buyer should now own the asset");

        // Check that the coin balances have been updated correctly.
        assertEq(coins.balanceOf(buyer), buyerInitialBalance - price, "Buyer's coin balance is incorrect");
        assertEq(coins.balanceOf(assetOwner), ownerInitialBalance + price, "Asset owner's coin balance is incorrect");
    }
}
