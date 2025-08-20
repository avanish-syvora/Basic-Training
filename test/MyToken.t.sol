// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyToken.sol"; 

contract MyTokenTest is Test {
    MyToken public myToken;
    address public owner = address(1);
    address public userA = address(2);
    address public userB = address(3);

    uint256 public constant INITIAL_SUPPLY = 1000;
    uint8 public constant DECIMALS = 18;

    function setUp() public {
        vm.prank(owner);
        myToken = new MyToken("MyToken", "MTK", DECIMALS, INITIAL_SUPPLY);
    }

    // Test 1: Checking if the constructor set the initial state correctly.
    function test_InitialState() public view {
        assertEq(myToken.name(), "MyToken", "Token name should be MyToken");
        assertEq(myToken.symbol(), "MTK", "Token symbol should be MTK");
        assertEq(myToken.decimals(), DECIMALS, "Token decimals should be 18");

        uint256 expectedTotalSupply = INITIAL_SUPPLY * (10**DECIMALS);
        assertEq(myToken.totalSupply(), expectedTotalSupply, "Total supply is incorrect");
        assertEq(myToken.balanceOf(owner), expectedTotalSupply, "Owner should have the initial supply");
    }

    // Test 2: Test the basic `transfer` function.
    function test_Transfer() public {
        uint256 amountToSend = 100 * (10**DECIMALS);
        uint256 ownerInitialBalance = myToken.balanceOf(owner);

        vm.prank(owner);
        myToken.transfer(userA, amountToSend);

        assertEq(myToken.balanceOf(userA), amountToSend, "userA balance is incorrect");
        assertEq(myToken.balanceOf(owner), ownerInitialBalance - amountToSend, "owner balance should be reduced");
    }

    // Test 3: Test a transfer that should fail due to insufficient balance.
    function test_Fail_Transfer_InsufficientBalance() public {
        uint256 amountToSend = 100 * (10**DECIMALS);

        
        vm.expectRevert("ERC20: transfer amount exceeds balance");
        vm.prank(userA);
        myToken.transfer(userB, amountToSend);
    }

    // Test 4: Test the `approve` and `allowance` functions.
    function test_Approve() public {
        uint256 amountToApprove = 500 * (10**DECIMALS);

        vm.prank(owner);
        myToken.approve(userA, amountToApprove);
        assertEq(myToken.allowance(owner, userA), amountToApprove, "Allowance is incorrect");
    }

    // Test 5: Test the full `transferFrom`
    function test_TransferFrom() public {
        uint256 amountToApprove = 500 * (10**DECIMALS);
        uint256 amountToTransfer = 200 * (10**DECIMALS);
        uint256 ownerInitialBalance = myToken.balanceOf(owner);

        vm.prank(owner);
        myToken.approve(userA, amountToApprove);

        vm.prank(userA);
        myToken.transferFrom(owner, userB, amountToTransfer);

        assertEq(myToken.balanceOf(userB), amountToTransfer, "userB balance is incorrect");
        assertEq(myToken.balanceOf(owner), ownerInitialBalance - amountToTransfer, "owner balance should be reduced");
        assertEq(myToken.allowance(owner, userA), amountToApprove - amountToTransfer, "Allowance should be reduced");
    }

    // Test 6: Test a transferFrom that should fail due to insufficient allowance.
    function test_Fail_TransferFrom_InsufficientAllowance() public {
        uint256 amountToTransfer = 200 * (10**DECIMALS);

      
        vm.expectRevert("ERC20: transfer amount exceeds allowance");

        vm.prank(userA);
        myToken.transferFrom(owner, userB, amountToTransfer);
    }

    // Test 7: NEW test for the zero amount transfer check.
    function test_Fail_Transfer_ZeroAmount() public {
        vm.expectRevert("ERC20: transfer amount must be greater than zero");
        vm.prank(owner);
        myToken.transfer(userA, 0);
    }
}
