# Solidity Ether Transfer & Rejection Handling

This project contains a set of Solidity smart contracts (`Task_1.sol`) that demonstrate fundamental patterns for sending, forwarding, and handling Ether transfers between contracts. It showcases a successful transfer chain and a scenario where a transfer is intentionally and gracefully rejected.

This is an excellent example for understanding the modern, recommended way to handle Ether payments using the low-level `.call()` method.

---

## Contracts Overview

There are four contracts, each with a specific role:

* **`ContractA_Caller`**: The entry point for all interactions. It initiates Ether transfers to other contracts.
* **`ContractB_Forwarder`**: A middleman contract. It is designed to automatically receive Ether and forward it to another address (`ContractC_Receiver`).
* **`ContractC_Receiver`**: The final destination for a successful transfer. It simply has the functionality to receive Ether.
* **`ContractD_Rejector`**: A contract specifically designed to fail. It will always reject any Ether sent to it.

---

## Scenarios Demonstrated

### 1. Successful Forwarding Chain (A → B → C)

This scenario shows a successful multi-hop Ether transfer.

1.  A user calls the `sendToB(addressB)` function in `ContractA_Caller`, sending some Ether with the transaction.
2.  `ContractA_Caller` uses `addressB.call{value: msg.value}("")` to send the Ether to `ContractB_Forwarder`.
3.  The `receive()` function in `ContractB_Forwarder` is triggered. It immediately forwards the received Ether to `ContractC_Receiver`.
4.  The `receive()` function in `ContractC_Receiver` is triggered, and the contract successfully receives the Ether, completing the chain.

### 2. Gracefully Handled Rejection (A → D)

This scenario demonstrates how to safely attempt an Ether transfer that might fail, without reverting the entire parent transaction.

1.  A user calls the `sendToD(addressD)` function in `ContractA_Caller`, sending some Ether.
2.  `ContractA_Caller` attempts to send the Ether to `ContractD_Rejector` using `.call()`.
3.  The `receive()` function in `ContractD_Rejector` is triggered but immediately executes `revert("...")`, rejecting the payment.
4.  Because `.call()` was used, the failure does not cause the transaction in `ContractA_Caller` to revert. Instead, `.call()` returns `success = false`.
5.  The code in `sendToD` catches this `false` value and emits a `ForwardFailure` event, logging the reason for the failure. The transaction in `ContractA_Caller` completes successfully.

---

## Key Concepts

* **`address.call{value: amount}("")`**: This is the modern, recommended low-level method for sending Ether. Unlike `.transfer()` or `.send()`, it does not have a hardcoded gas limit and it returns a boolean (`success`) indicating if the call was successful, which allows for robust error handling.
* **`receive()` external payable**: This is a special function in Solidity. A contract can have at most one `receive` function, which is executed on a call to the contract with empty calldata. This is the function that gets triggered when the contract receives plain Ether without any function being called.
* **Error Handling with `.call()`**: This example clearly contrasts two ways to handle the result of `.call()`:
    * Using `require(success, "Error message")` when a successful transfer is critical for the function to continue.
    * Using an `if/else` block to gracefully handle an expected failure without reverting the entire transaction.
