// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Test, console} from "forge-std/Test.sol";
import {Vesting} from "../src/Vesting.sol";
import {IVesting} from "../src/IVesting.sol";

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

    uint256 public constant TOTAL = 1000000 ether;
    uint256 public constant VEST = 100000 ether;
    uint256 public constant REWARD = 50000 ether;

    function setUp() public {
        owner = address(this);
        vm.startPrank(owner);

        token = new TestToken();
        token.mint(owner, TOTAL);
        
        vesting = new Vesting(manager);
        vesting.setFeeAddresses(manager, referrer);


        token.approve(address(vesting), TOTAL);

        vm.stopPrank();
    }

    /**
     * @notice creating a schedule and withdrawing after the cliff
     */
    function test_CreateAndWithdraw() public {
        vm.startPrank(owner);
        vesting.fundRewardPool(address(token), REWARD);
        vesting.createVestingSchedule(
            beneficiary,
            address(token),
            VEST,
            365 days, 
            90 days,  
            IVesting.FeeMode.Manager
        );
        vm.stopPrank();
        vm.warp(block.timestamp + 91 days);
        vm.prank(beneficiary);
        vesting.withdraw(address(token));
        assertTrue(token.balanceOf(beneficiary) > 0, "Beneficiary should received tokens");
        uint256 fee = (VEST * 5) / 100;
        uint256 amountVested = VEST - fee;
        uint256 expectedVested = (amountVested * 91) / 365; 
        assertTrue(token.balanceOf(beneficiary) > expectedVested, "Beneficiary balance should be greater than vested amount due to rewards");
    }
}
