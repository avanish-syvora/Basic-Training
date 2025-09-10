// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./OwnableUpgradeable.sol"; 

/**
 * @title UUPSTokenV1
 * @notice Logic V1 for the UUPS Proxy (Hybrid Approach).
 */
contract UUPSTokenV1 is ERC20Upgradeable, CustomOwnableUpgradeable {
    bytes32 private constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    function initialize(string memory name, string memory symbol) public initializer {
        __ERC20_init(name, symbol);
        __Ownable_init(); 
        _mint(msg.sender, 1_000_000 * (10**decimals()));
    }

    function version() public pure returns (string memory) {
        return "UUPS V1 (Hybrid)";
    }

    /**
     * @notice UUPS pattern ka core: upgrade logic implementation ke andar.
     */
    function upgradeTo(address newImplementation) external onlyOwner {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly {
            sstore(slot, newImplementation)
        }
    }
}

/**
 * @title UUPSTokenV2
 * @notice Logic V2, adding pausable functionality.
 */
contract UUPSTokenV2 is ERC20Upgradeable, CustomOwnableUpgradeable {
    // EIP-1967 standard implementation slot
    bytes32 private constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
    
    bool private _paused;
    event Paused(address account);
    event Unpaused(address account);

    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    function version() public pure returns (string memory) {
        return "UUPS V2 (Hybrid)";
    }

    // Override transfer to make it pausable
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }
    
    // New functions in V2
    function pause() public onlyOwner {
        _paused = true;
        emit Paused(msg.sender);
    }

    function unpause() public onlyOwner {
        _paused = false;
        emit Unpaused(msg.sender);
    }

    /**
     * @notice Upgrade logic V2 mein bhi hona zaroori hai.
     */
    function upgradeTo(address newImplementation) external onlyOwner {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly {
            sstore(slot, newImplementation)
        }
    }
}
