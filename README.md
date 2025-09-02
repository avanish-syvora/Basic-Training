# Solidity Token Vesting Contract with Incentivized Rewards

This project contains a sophisticated and gas-efficient smart contract system for handling time-based ERC20 token vesting. It is designed to be flexible, owner-managed, and includes a unique quadratic reward mechanism to incentivize beneficiaries.

The system is composed of an interface (`IVesting.sol`), the core implementation (`Vesting.sol`), and is tested using the Foundry framework (`Vesting.t.sol`).

## Key Features

* **Time-based Vesting**: Standard linear release of tokens over a specified duration after an initial cliff period.
* **Batch Schedule Creation**: Ability to create vesting schedules for multiple beneficiaries in a single transaction to save gas.
* **Incentivized Rewards**: A unique quadratic reward formula that encourages beneficiaries to withdraw tokens as they vest. The reward amount increases non-linearly over the vesting duration.
* **Dual Fee Modes**: The contract owner can choose between two fee models when creating a schedule:
    * **`Manager` Mode**: A flat 5% fee is sent to a designated manager address.
    * **`Referral` Mode**: The fee is split, with 2% going to the manager and 2% to a referrer.
* **Owner-Managed**: Key parameters like fee addresses and the reward factor are configurable by the contract owner.
* **Secure and Robust**: Uses OpenZeppelin's `SafeERC20` for safe token transfers and `Ownable` for access control.
* **Foundry-based Testing**: Comes with a comprehensive test suite to ensure correctness.

## Contracts Overview

* **`src/IVesting.sol`**: The interface that defines the data structures (`VestingSchedule`, `FeeMode`), events, and all external functions for the `Vesting` contract.
* **`src/Vesting.sol`**: The core implementation of the vesting logic. It handles schedule creation, fee distribution, withdrawals, and reward calculations.
* **`test/Vesting.t.sol`**: The Foundry test suite for the contract, covering the creation of schedules and withdrawal with rewards.

## Core Logic Explained

### 1. Vesting Schedule Creation

The owner can create schedules using `createVestingSchedule` (for one) or `batchCreate` (for many). When a schedule is created, the contract:
1.  Calculates the required fee based on the selected `FeeMode`.
2.  Uses `safeTransferFrom` to pull the fee amount from the owner and sends it to the `manager` and/or `referrer`.
3.  Pulls the remaining token amount (the principal to be vested) from the owner and holds it in the contract.
4.  Stores the vesting parameters (total amount, duration, cliff, etc.) in a `VestingSchedule` struct for the beneficiary.

### 2. Withdrawal vs. Release

* **`withdraw(token)`**: This function is called by a beneficiary *during* the vesting period (but after the cliff). It calculates the currently vested amount, transfers those tokens plus any earned rewards to the beneficiary, and updates their `releasedAmount`.
* **`release(beneficiary, token)`**: This function can be called by anyone *after* the entire vesting duration has ended. It transfers the entire remaining principal and the final reward amount to the beneficiary, effectively closing out the schedule.

### 3. Quadratic Reward Calculation

The reward mechanism is designed to be time-sensitive. The formula for calculating the reward is:

`rewardAmount = (amount * rewardFactor * timeElapsed^2) / (totalDuration^2 * 100)`

Where:
* `timeElapsed` is the time since the vesting started.
* This quadratic relationship (`timeElapsed^2`) means that rewards accumulate much faster as the vesting schedule approaches its end date, providing a strong incentive.

## Getting Started

### Prerequisites

* [Foundry](https://github.com/foundry-rs/foundry) must be installed.

### Installation & Setup

1.  Clone the repository:
    ```
    git clone <repository_url>
    cd <repository_name>
    ```
2.  Install dependencies:
    ```
    forge install
    ```

### Compile
forge build


### Test

Run the test suite to verify the contract's functionality.
forge test -vvv


### File Structure

.
├── src
│   ├── IVesting.sol
│   └── Vesting.sol
└── test
    └── Vesting.t.sol
