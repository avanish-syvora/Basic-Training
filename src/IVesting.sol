// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IVesting
 * @notice Interface for the Vesting contract
 */

interface IVesting {

   
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint64 startTime;
        uint64 endTime;
        uint64 cliffDuration;
    }

    enum FeeMode {
        Manager,
        Referral
    }

    //  Eves--

    event ScheduleCreated(
        address indexed beneficiary,
        address indexed token,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        uint64 cliffDuration
    );
    event TokensWithdrawn(address indexed beneficiary, address indexed token, uint256 amount, uint256 rewardAmount);
    event ScheduleReleased(address indexed beneficiary, address indexed token, uint256 finalAmount, uint256 finalReward);
    event RewardPoolFunded(address indexed token, uint256 amount);
    event FeeAddressesSet(address indexed manager, address indexed referrer);
    event RewardFactorSet(uint256 newFactor);

    //  Funcs

    function setFeeAddresses(address _managerAddress, address _referrerAddress) external;
    function setRewardFactor(uint256 _rewardFactor) external;
    function fundRewardPool(address _token, uint256 _amount) external;
    function createVestingSchedule(
        address _beneficiary,
        address _token,
        uint256 _totalAmount,
        uint64 _duration,
        uint64 _cliffDuration,
        FeeMode _mode
    ) external;
    function batchCreate(
        address[] calldata _beneficiaries,
        address _token,
        uint256[] calldata _amounts,
        uint64 _duration,
        uint64 _cliffDuration,
        FeeMode _mode
    ) external;
    function withdraw(address _token) external;
    function release(address _beneficiary, address _token) external;
}
