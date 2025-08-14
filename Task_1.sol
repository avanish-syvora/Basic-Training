// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ContractA_Caller
 * @notice This contract initiates Ether transfers to other contracts.
 * @dev It has two functions: one for a successful transfer chain (A->B->C)
 * and one for a transfer that is expected to be rejected (A->D).
 */
contract ContractA_Caller {
    event ForwardSuccess(address indexed to, uint256 amount);
    event ForwardFailure(address indexed to, bytes reason);

    /**
     * @notice Sends ETH to ContractB, which should forward it to ContractC.
     * @param contractB The address of the forwarding contract (ContractB).
     * @dev This function sends the full value of the transaction to contractB.
     * It uses the .call method, which is the recommended way to send Ether.
     */
    function sendToB(address payable contractB) external payable {
        require(msg.value > 0, "Must send some Ether");
        (bool success, ) = contractB.call{value: msg.value}("");
        require(success, "Failed to send Ether to ContractB");
    }

    /**
     * @notice Attempts to send ETH to ContractD, which is designed to reject it.
     * @param contractD The address of the rejecting contract (ContractD).
     * @dev The transaction is expected to revert because ContractD will reject the payment.
     * We use a try-catch block to handle the expected failure gracefully.
     */
    function sendToD(address payable contractD) external payable {
        require(msg.value > 0, "Must send some Ether");

        // Using .call to attempt the transfer
        (bool success, bytes memory reason) = contractD.call{value: msg.value}("");

        if (success) {
            emit ForwardSuccess(contractD, msg.value);
        } else {
            // This event will be emitted, showing the failure reason from ContractD.
            emit ForwardFailure(contractD, reason);
        }
    }
}

/**
 * @title ContractB_Forwarder
 * @notice This contract receives Ether and automatically forwards it to ContractC.
 * @dev It uses the receive() special function to handle incoming Ether.
 */
contract ContractB_Forwarder {
    address payable public contractC_address;

    event Forwarded(address indexed to, uint256 amount);

    /**
     * @param initial_C_Address The address of ContractC where Ether will be forwarded.
     */
    constructor(address payable initial_C_Address) {
        contractC_address = initial_C_Address;
    }

    // This function is automatically triggered when the contract receives Ether.
    receive() external payable {
        require(msg.value > 0, "Must receive some Ether to forward");
        (bool success, ) = contractC_address.call{value: msg.value}("");
        require(success, "Forwarding to ContractC failed");

        emit Forwarded(contractC_address, msg.value);
    }
}

/**
 * @title ContractC_Receiver
 * @notice This is the final destination for the Ether in the successful transfer chain.
 * @dev It simply accepts Ether.
 */
contract ContractC_Receiver {
    event Received(address indexed from, uint256 amount);

    // This function is automatically triggered when the contract receives Ether.
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}

/**
 * @title ContractD_Rejector
 * @notice This contract is designed to always reject any Ether sent to it.
 * @dev Its receive() function explicitly reverts the transaction.
 */
contract ContractD_Rejector {
    // This function is automatically triggered when the contract receives Ether
    // and it will always fail the transaction.
    receive() external payable {
        revert("ContractD does not accept Ether payments.");
    }
}
