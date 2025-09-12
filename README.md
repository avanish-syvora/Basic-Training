
# Universal Token (UTK) Cross-Chain Bridge

## Description

This project is an implementation of a cross-chain bridge for a **Universal Token (UTK)**. The bridge allows users to seamlessly transfer their UTK tokens between two different EVM-compatible blockchains. Currently, it supports the **Base Sepolia Testnet** and the **HOODI Testnet**.

The bridge operates on a "burn-and-mint" mechanism, which ensures that the total circulating supply of the token remains constant across all supported chains.

## Core Components

1.  **`UniversalToken.sol`**: A standard ERC-20 token contract. Its unique feature is that its `mint` and `burn` functions can only be called by the official Bridge contract.

2.  **`Bridge.sol`**: The main smart contract deployed on each chain. It accepts tokens from users, `burns` them, and emits a `TokensBridged` event. It also processes events from the other chain to `mint` new tokens for the recipient.

3.  **`relayer.js`**: An off-chain Node.js script that acts as a messenger. It listens for events emitted on one chain and relays the necessary information to the Bridge contract on the other chain to initiate the minting process.

## Tech Stack

* **Smart Contracts**: Solidity, OpenZeppelin Contracts
* **Development Environment**: Hardhat
* **Blockchain Interaction**: Ethers.js
* **Relayer Backend**: Node.js
* **Dependency Management**: npm

## Setup & Installation

Follow these steps to run the project on your local machine.

### Prerequisites

* Node.js (v18 or higher)
* npm (v9 or higher)

### Installation Steps

1.  **Clone the Repository (Hypothetical):**
    ```bash
    git clone <your-repo-url>
    cd UTK-Bridge
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` File:**
    In the project's root directory, create a file named `.env`. Copy the format from the `.env.example` below and fill it with your actual values.

    ```env
    # .env.example
    
    # A new, secret private key exported from MetaMask
    PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY"
    
    # Your Base Sepolia RPC URL from a service like Alchemy or Infura
    BASE_SEPOLIA_RPC_URL="YOUR_ALCHEMY_HTTPS_URL"
    
    # The public RPC for HOODI Testnet
    HOODI_RPC_URL="[https://sepolia-rpc.hoodi.finance/](https://sepolia-rpc.hoodi.finance/)"
    
    # --- Deployed Contract Addresses ---
    
    # CHAIN A (Base Sepolia)
    CHAIN_A_BRIDGE_ADDRESS="0x7E02a76721e4A54f27aAc0AA3e6184822F702d3d"
    CHAIN_A_TOKEN_ADDRESS="0xa5E84c654e6d97341ab53414A838B00d0e41B973"
    
    # CHAIN B (HOODI Testnet)
    CHAIN_B_BRIDGE_ADDRESS="0x0f32d973A70F643F94fBE3b2BCbC67e36d9Eca46"
    CHAIN_B_TOKEN_ADDRESS="0x0d49218f085a260fA060e35d3202D57c717d5854"
    ```

## Running the Project

### 1. Deploy Contracts

If you need to deploy new versions of the contracts, run the following commands.

```bash
# Deploy to Chain A (Base Sepolia)
npx hardhat run scripts/deploy.js --network baseSepolia

# Deploy to Chain B (HOODI Testnet)
npx hardhat run scripts/deploy.js --network hoodiTestnet
````

After deployment, update the `.env` file with the new contract addresses.

### 2\. Start the Relayer

Once the contracts are deployed and the `.env` file is configured, start the relayer.

```bash
node scripts/relayer.js
```

This script will begin listening for events on both chains.

### 3\. Use the Bridge

In a new terminal, initiate a cross-chain transfer using the `interact.js` script.

```bash
# Example: Initiating a transfer from Base Sepolia (Chain A)
npx hardhat run scripts/interact.js --network baseSepolia
```

