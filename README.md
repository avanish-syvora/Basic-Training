# Simple Token Exchange DApp

This project implements a basic, decentralized exchange (DEX) on the blockchain. It consists of two main smart contracts: an ERC20-style token (`Coins`) that acts as a currency, and an ERC721-style token (`Assets`) that represents unique, non-fungible items. The `Assets` contract contains the core logic that allows users to list their assets for sale and for others to purchase them using `Coins`.

The entire system is self-contained and demonstrates a fundamental pattern for peer-to-peer digital asset trading.

## Key Features

* **ERC20 Fungible Token (`Coins`):** A simple currency contract (`Coins.sol`) used as the medium of exchange. It includes an `ownerMint` function for the contract deployer to create new tokens.
* **ERC721 Non-Fungible Token (`Assets`):** A contract (`Assets.sol`) for unique digital items. Anyone can mint a new `Asset` for themselves.
* **Decentralized Exchange Logic:** The `Assets` contract facilitates the direct exchange of an `Asset` for `Coins` between a buyer and a seller without a trusted intermediary.
* **Two-Step Sale Approval:** To ensure security and user intent, a seller must perform two actions to list an asset:
  1. `setPrice()`: Set the price of the asset in `Coins`.
  2. `approveForExchange()`: Explicitly authorize the contract to perform the swap. This prevents accidental sales and confirms the seller's intent to trade at the set price.
* **Foundry Testing:** The project includes a comprehensive integration test (`exchange.t.sol`) to validate the full exchange lifecycle.

## Contracts Overview

* `src/Coins.sol`: Implements the ERC20-compliant "Coins" token (`CN`).
* `src/Assets.sol`: Implements the ERC721-compliant "Assets" token (`AST`) and contains the exchange functionality.
* `src/ICoins.sol` & `src/IAssets.sol`: Interfaces defining the functions for each token standard.
* `test/exchange.t.sol`: The Foundry test file that simulates a complete and successful asset exchange.

## How the Exchange Works

The exchange process is designed to be secure and explicit, requiring actions from both the seller and the buyer.

#### For the Seller (Asset Owner):

1. **Mint an Asset:** The seller first calls `mint()` on the `Assets` contract to create a new unique token.
2. **Set the Price:** The seller calls `setPrice(tokenId, price)`, specifying which asset they want to sell and for how many `Coins`.
3. **Approve the Exchange:** The seller calls `approveForExchange(tokenId)` to give the `Assets` contract final permission to execute the trade.

#### For the Buyer:

1. **Acquire Coins:** The buyer must have a sufficient balance of `Coins` to afford the asset.
2. **Approve Spending:** The buyer calls `approve(spender, amount)` on the `Coins` contract, where the `spender` is the `Assets` contract address and `amount` is the price of the asset. This allows the `Assets` contract to pull the payment from the buyer's wallet.
3. **Execute Exchange:** The buyer calls `exchange(tokenId)` on the `Assets` contract.

The `exchange` function then atomically performs the swap: it transfers the `Coins` from the buyer to the seller and the `Asset` from the seller to the buyer. After the trade, the price and exchange approval for that asset are reset to zero and false, respectively.

## Getting Started

### Prerequisites

* You must have [Foundry](https://github.com/foundry-rs/foundry) installed.

### Installation

Clone the repository and install the dependencies:
```bash
git clone https://github.com/avanish-syvora/Basic-Training
cd Basic-Training
forge install
```

Compile
```Bash

forge build
```
Test
Run the integration test to ensure all functionality works as expected:

```Bash

forge test -vvv
```
