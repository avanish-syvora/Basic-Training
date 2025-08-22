// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IVesting.sol"; // Import the new interface file
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Vesting
 * @author AVANISH
 * @notice A contract for time-based token vesting with incentivized rewards.
 */
contract Vesting is IVesting, Ownable {
    using SafeERC20 for IERC20;

    address public manager;
    address public referrer;
    uint256 public reward = 10;
    mapping(address => mapping(address => VestingSchedule)) public schedules;

    /**
     * @notice setting deployer as the owner
     * @param _managerAdd The address to receive fees in Manager mode.
     */
    constructor(address _managerAdd) Ownable(msg.sender) {
        require(_managerAdd != address(0), "Zero Address");
        manager = _managerAdd;
    }

    /**
     * @notice addresses for the fees modes.
     */
    function setFeeAddresses(address _managerAdd, address _referrerAdd) external override onlyOwner {
        require(_managerAdd != address(0) && _referrerAdd != address(0), "Zero Address");
        manager = _managerAdd;
        referrer = _referrerAdd;
        emit FeeAddressesSet(_managerAdd, _referrerAdd);
    }

    /**
     * @notice factor for withdrawal rewards
     */
    function setRewardFactor(uint256 _rewardFactor) external override onlyOwner {
        reward = _rewardFactor;
        emit RewardFactorSet(_rewardFactor);
    }

    /**
     * @notice Allows the owner to fund the contract with tokens for rewards.
     */
    function fundRewardPool(address _token, uint256 _amount) external override onlyOwner {
        require(_amount > 0, "Amount <m= zero");
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        emit RewardPoolFunded(_token, _amount);
    }

    /**
     * @notice Creates a new vesting schedule for a single  */
    function createVestingSchedule(
        address _beneficiary,
        address _token,
        uint256 _totalAmount,
        uint64 _duration,
        uint64 _cliffDuration,
        FeeMode _mode
    ) external override onlyOwner {
        _createSchedule(_beneficiary, _token, _totalAmount, _duration, _cliffDuration, _mode);
    }

    /**
     * @notice Creates multiple vesting schedules
     */
    function batchCreate(
        address[] calldata _beneficiaries,
        address _token,
        uint256[] calldata _amounts,
        uint64 _duration,
        uint64 _cliffDuration,
        FeeMode _mode
    ) external override onlyOwner {
        require(_beneficiaries.length == _amounts.length, "Array lengths must match");
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            _createSchedule(_beneficiaries[i], _token, _amounts[i], _duration, _cliffDuration, _mode);
        }
    }

    /**
     * @notice withdraw currenting
     */
    function withdraw(address _token) external override{
        VestingSchedule storage schedule = schedules[msg.sender][_token];
        require(schedule.startTime > 0, "No schedule");
        require(block.timestamp < schedule.endTime, "Vesting ended, use release");

        uint256 vestedAmount = _vestedAmount(schedule);
        require(vestedAmount > schedule.releasedAmount, "No tokens to withdraw");

        uint256 amountToWithdraw = vestedAmount - schedule.releasedAmount;
        uint256 rewardAmount = _reward(schedule, amountToWithdraw);

        schedule.releasedAmount = vestedAmount;

        IERC20(_token).safeTransfer(msg.sender, amountToWithdraw + rewardAmount);
        emit TokensWithdrawn(msg.sender, _token, amountToWithdraw, rewardAmount);
    }

    /**
     * @notice Can be called by anyone after the vesting period has ended.
     */
    function release(address _beneficiary, address _token) external override {
        VestingSchedule storage schedule = schedules[_beneficiary][_token];
        require(schedule.startTime > 0, "No vesting schedule found");
        require(block.timestamp >= schedule.endTime, "Vesting period not yet ended");

        uint256 remainingAmount = schedule.totalAmount - schedule.releasedAmount;
        uint256 rewardAmount = _reward(schedule, remainingAmount);
        schedule.releasedAmount = schedule.totalAmount;

        IERC20(_token).safeTransfer(_beneficiary, remainingAmount + rewardAmount);
        emit ScheduleReleased(_beneficiary, _token, remainingAmount, rewardAmount);
    }

    /**
     * @notice Calculates the amount of tokens that have vested at the current time.
     */
    function _vestedAmount(VestingSchedule memory _schedule) internal view returns (uint256) {
        if (block.timestamp < _schedule.startTime + _schedule.cliffDuration) {
            return 0;
        }
        if (block.timestamp >= _schedule.endTime) {
            return _schedule.totalAmount;
        }

        uint256 vestingDuration = _schedule.endTime - _schedule.startTime;
        uint256 time = block.timestamp - _schedule.startTime;

        return (_schedule.totalAmount * time) / vestingDuration;
    }

    /**
     * @notice Calculates reward...
     */
    function _reward(VestingSchedule memory _schedule, uint256 _amount) internal view returns (uint256) {
        if (reward == 0) return 0;

        uint256 totalDuration = _schedule.endTime - _schedule.startTime;
        uint256 time = block.timestamp > _schedule.endTime ? totalDuration : block.timestamp - _schedule.startTime;

        uint256 rewardF = (_amount * reward * time * time) / (totalDuration * totalDuration * 100);
        return rewardF;
    }

    /**
     * @dev create and fund vesting schedule
     */
    function _createSchedule(
        address _beneficiary,
        address _token,
        uint256 _totalAmount,
        uint64 _duration,
        uint64 _cliffDuration,
        FeeMode _mode
    ) internal {
        require(_beneficiary != address(0), "zero address");
        require(schedules[_beneficiary][_token].startTime == 0, "already exists");
        require(_totalAmount > 0, "Amount <= zero");
        require(_duration > _cliffDuration, "Duration <= cliff");

        uint256 amountToVest = _totalAmount;
        IERC20 tokenContract = IERC20(_token);

        if (_mode == FeeMode.Manager) {
            
            uint256 managerFee = (_totalAmount * 5) / 100;
            if (managerFee > 0) {
                amountToVest -= managerFee;
                tokenContract.safeTransferFrom(msg.sender, manager, managerFee);
            }
        } else { 
            require(referrer != address(0), "Referrer address not set");
            uint256 managerFee = (_totalAmount * 2) / 100;
            uint256 referrerFee = (_totalAmount * 2) / 100;
            if (managerFee > 0) {
                amountToVest -= managerFee;
                tokenContract.safeTransferFrom(msg.sender, manager, managerFee);
            }
            if (referrerFee > 0) {
                amountToVest -= referrerFee;
                tokenContract.safeTransferFrom(msg.sender, referrer, referrerFee);
            }
        }

        tokenContract.safeTransferFrom(msg.sender, address(this), amountToVest);

        uint64 startTime = uint64(block.timestamp);
        schedules[_beneficiary][_token] = VestingSchedule({
            totalAmount: amountToVest,
            releasedAmount: 0,
            startTime: startTime,
            endTime: startTime + _duration,
            cliffDuration: _cliffDuration
        });

        emit ScheduleCreated(_beneficiary, _token, amountToVest, startTime, startTime + _duration, _cliffDuration);
    }
}
