# Solidity ERC20 Token Transfer and Approval Chains

This project (`Task_2.sol`) demonstrates how to handle multi-step ERC20 token transfers between smart contracts using the `approve` and `transferFrom` pattern. It includes a full-featured example of a successful forwarding chain and a scenario where a token transfer is intentionally reverted.

This is a critical concept for anyone building DeFi applications, as it's the standard way for contracts to interact with tokens they don't own.

---

## Contracts Overview

* **`MyToken`**: A basic ERC20 token contract with a public `mint` function, allowing anyone to get tokens for testing purposes.
* **`ContractA_TokenCaller`**: The starting point for the token transfer logic. It is responsible for pulling tokens from the end-user and then delegating the next step to another contract.
* **`ContractB_TokenForwarder`**: The middleman in the successful transfer chain. It is designed to pull tokens from `ContractA` and send them to the final destination, `ContractC`.
* **`ContractC_TokenReceiver`**: The final destination for the tokens in the successful transfer. It holds the tokens and has a function to check its balance.
* **`ContractD_TokenRejector`**: A contract designed to fail. It has a function that, when called, will always revert the transaction.

---

## Scenarios Demonstrated

The core of this project is the **approve/transferFrom** pattern. A user doesn't *send* tokens to Contract A. Instead, the user **approves** Contract A to withdraw a certain amount, and then Contract A **pulls** the tokens using `transferFrom`.

### 1. Successful Forwarding Chain (User → A → B → C)

This scenario shows how tokens can be moved through multiple contracts without the original owner having to trust every contract in the chain.

1.  **User Pre-approval**: The user (an Externally Owned Account) first calls the `approve()` function on the `MyToken` contract, granting `ContractA_TokenCaller` permission to withdraw a specific amount of tokens.
2.  **Start the Chain**: The user calls `startForwardingChain()` on `ContractA_TokenCaller`.
3.  **Step A**: `ContractA` pulls the approved tokens from the user to itself using `token.transferFrom(msg.sender, address(this), amount)`.
4.  **Step A to B**: `ContractA` then approves `ContractB_TokenForwarder` to withdraw those same tokens from it.
5.  **Trigger B**: `ContractA` calls the `forwardTokens()` function on `ContractB`.
6.  **Step B to C**: Inside `forwardTokens()`, `ContractB` now has the authority to pull the tokens from `ContractA` and send them directly to the final destination, `ContractC`, using `token.transferFrom(addressA, addressC, amount)`.

### 2. Reverting Transfer Chain (User → A → D)

This scenario shows how a failure in a downstream contract will revert the entire transaction chain.

1.  **User Pre-approval**: The user approves `ContractA_TokenCaller` to withdraw tokens.
2.  **Start the Chain**: The user calls `startRejectionChain()` on `ContractA_TokenCaller`.
3.  **Step A**: `ContractA` pulls the tokens from the user.
4.  **Step A to D**: `ContractA` approves `ContractD_TokenRejector` to pull the tokens.
5.  **Trigger D**: `ContractA` calls the `tryToPullTokens()` function on `ContractD`.
6.  **Rejection**: The function in `ContractD` immediately reverts. Because this call was not wrapped in a `try/catch` block, the entire transaction, including the initial `transferFrom` in `ContractA`, is reverted. The user's tokens are returned as if the transaction never happened.

---

## Key Concepts

* **`approve(spender, amount)`**: An ERC20 function where a token owner gives a `spender` (another address or contract) permission to withdraw up to `amount` tokens from their account.
* **`transferFrom(from, to, amount)`**: An ERC20 function that allows a `spender` to transfer tokens from the `from` address to the `to` address. This can only succeed if the `spender` has been previously approved for at least that `amount`.
* **Chain of Approvals**: This project demonstrates that for a contract to move tokens through a multi-step process, a chain of approvals is necessary. `User` must approve `A`, and `A` must approve `B`.
* **Transaction Reversion**: Unlike the Ether transfer example using `.call()`, a direct external function call that reverts will cause the entire parent transaction to revert unless handled with a `try/catch` block. This example shows the default "all-or-nothing" behavior.
