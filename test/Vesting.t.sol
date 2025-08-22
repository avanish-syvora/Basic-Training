// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Vesting} from "../src/Vesting.sol";
import {IVesting} from "../src/IVesting.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// A test-specific token that inherits from the real OpenZeppelin ERC20 contract.
// This allows us to mint tokens for testing purposes.
contract TestToken is ERC20 {
    constructor() ERC20("Test Token", "TST") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}


contract VestingTest is Test {
    Vesting public vesting;
    TestToken public token;

    address public owner;
    address public beneficiary = makeAddr("beneficiary");
    address public manager = makeAddr("manager");
    address public referrer = makeAddr("referrer");

    uint256 public constant TOTAL_SUPPLY = 1_000_000 ether;
    uint256 public constant VESTING_AMOUNT = 100_000 ether;
    uint256 public constant REWARD_POOL_AMOUNT = 50_000 ether;

    function setUp() public {
        owner = address(this);
        vm.startPrank(owner);

        token = new TestToken();
        token.mint(owner, TOTAL_SUPPLY);
        
        vesting = new Vesting(manager);
        vesting.setFeeAddresses(manager, referrer);

        // Approve the vesting contract to spend tokens on behalf of the owner
        token.approve(address(vesting), TOTAL_SUPPLY);

        vm.stopPrank();
    }

    /**
     * @notice A basic test for creating a schedule and withdrawing after the cliff.
     */
    function test_CreateAndWithdraw() public {
        vm.startPrank(owner);
        vesting.fundRewardPool(address(token), REWARD_POOL_AMOUNT);
        vesting.createVestingSchedule(
            beneficiary,
            address(token),
            VESTING_AMOUNT,
            365 days, 
            90 days,  
            IVesting.FeeMode.Manager
        );
        vm.stopPrank();
        vm.warp(block.timestamp + 91 days);
        vm.prank(beneficiary);
        vesting.withdraw(address(token));
        assertTrue(token.balanceOf(beneficiary) > 0, "Beneficiary should received tokens");
        uint256 fee = (VESTING_AMOUNT * 5) / 100;
        uint256 amountVested = VESTING_AMOUNT - fee;
        uint256 expectedVested = (amountVested * 91) / 365; 
        assertTrue(token.balanceOf(beneficiary) > expectedVested, "Beneficiary balance should be greater than vested amount due to rewards");
    }
}
