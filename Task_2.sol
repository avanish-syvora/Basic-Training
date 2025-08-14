// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MyToken
 * @notice A basic mintable ERC20 token for testing purposes.
 */
contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {}

    // Allows anyone to mint tokens to themselves for testing
    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}

/**
 * @title ContractA_TokenCaller
 * @notice Initiates the token transfer chain.
 * @dev It pulls tokens from the user (who must first grant an allowance),
 * then approves ContractB to perform the next step.
 */
contract ContractA_TokenCaller {
    event ChainStarted(address indexed token, address indexed destinationB, uint256 amount);
    event RejectionChainStarted(address indexed token, address indexed destinationD, uint256 amount);

    // Scenario 1: Successful Forwarding (User -> A -> B -> C)
    function startForwardingChain(
        address tokenAddress,
        address contractB,
        address contractC,
        uint256 amount
    ) external {
        IERC20 token = IERC20(tokenAddress);
        
        // 1. Pull tokens from the User (msg.sender) to this contract (A).
        // This requires the User to have approved this contract first.
        token.transferFrom(msg.sender, address(this), amount);

        // 2. Approve ContractB to spend these tokens on behalf of this contract (A).
        token.approve(contractB, amount);
        
        emit ChainStarted(tokenAddress, contractB, amount);
        
        // 3. Trigger the forwarding function in ContractB.
        // We must use an interface or a direct contract type to call the function.
        ContractB_TokenForwarder(payable(contractB)).forwardTokens(tokenAddress, contractC, amount);
    }

    // Scenario 2: Rejected Transfer (User -> A -> D)
    function startRejectionChain(address tokenAddress, address contractD, uint256 amount) external {
        IERC20 token = IERC20(tokenAddress);

        // 1. Pull tokens from the user to this contract (A).
        token.transferFrom(msg.sender, address(this), amount);

        // 2. Approve ContractD to spend tokens.
        token.approve(contractD, amount);

        emit RejectionChainStarted(tokenAddress, contractD, amount);
        
        // 3. Trigger the rejection function in ContractD. This call will revert.
        ContractD_TokenRejector(payable(contractD)).tryToPullTokens(tokenAddress, address(this), amount);
    }
}

/**
 * @title ContractB_TokenForwarder
 * @notice Forwards tokens from ContractA to ContractC.
 */
contract ContractB_TokenForwarder {
    event TokensForwarded(address indexed token, address indexed from, address indexed to, uint256 amount);

    function forwardTokens(address tokenAddress, address contractC, uint256 amount) external {
        IERC20 token = IERC20(tokenAddress);

        // Pull tokens from ContractA (msg.sender of the cross-contract call) to ContractC.
        // This is only possible because ContractA approved this contract (B) to spend its tokens.
        token.transferFrom(msg.sender, contractC, amount);

        emit TokensForwarded(tokenAddress, msg.sender, contractC, amount);
    }
}

/**
 * @title ContractC_TokenReceiver
 * @notice The final destination for the tokens.
 */
contract ContractC_TokenReceiver {
    // Function to check the token balance of this contract
    function getTokenBalance(address tokenAddress) public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }
}

/**
 * @title ContractD_TokenRejector
 * @notice This contract is designed to fail when asked to pull tokens.
 */
contract ContractD_TokenRejector {
    function tryToPullTokens(address, address, uint256) external pure {
        // This contract deliberately fails to complete its task.
        // It could have faulty logic or, as in this case, simply revert.
        revert("ContractD: I am programmed to reject this operation.");
    }
}
