// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Proxy
 * @dev A basic proxy contract that delegates all calls to an implementation contract
 */
abstract contract Proxy {
    // EIP-1967 standard implementation address storage slot
    bytes32 private constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /**
     * @dev Returns the implementation contract address
     */
    function _implementation() internal view returns (address impl) {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly {
            impl := sload(slot)
        }
    }

    /**
     * @dev Sets the implementation contract address
     */
    function _setImplementation(address newImplementation) internal {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly {
            sstore(slot, newImplementation)
        }
    }

    /**
     * @dev Delegates all calls to the implementation contract
     */
    fallback() external payable virtual {
        _fallback();
    }

    function _fallback() internal virtual {
        address impl = _implementation();
        require(impl != address(0), "Proxy: implementation not set");

        assembly {
            // Copy calldata
            calldatacopy(0, 0, calldatasize())
            
            // Delegatecall
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            
            // Copy return data
            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}

/**
 * @title ProxyAdmin
 * @notice The owner of the Transparent proxies who manages upgrades
 */
contract ProxyAdmin is Ownable {
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Upgrades the proxy to a new implementation
     */
    function upgrade(address proxy, address newImplementation) external onlyOwner {
        (bool success, ) = proxy.call(
            abi.encodeWithSignature("upgradeTo(address)", newImplementation)
        );
        require(success, "ProxyAdmin: upgrade failed");
    }
}

/**
 * @title TransparentProxy
 * @notice A proxy with a separate admin logic
 */
contract TransparentProxy is Proxy {
    // EIP-1967 standard ke according admin address ka storage slot.
    bytes32 private constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    function _setAdmin(address newAdmin) internal {
        bytes32 slot = _ADMIN_SLOT;
        assembly {
            sstore(slot, newAdmin)
        }
    }

    function _admin() internal view returns (address adm) {
        bytes32 slot = _ADMIN_SLOT;
        assembly {
            adm := sload(slot)
        }
    }

    constructor(address initialImplementation, address admin, bytes memory data) payable {
        _setImplementation(initialImplementation);
        _setAdmin(admin);
        if (data.length > 0) {
            (bool success, ) = initialImplementation.delegatecall(data);
            require(success, "Proxy: initialization failed");
        }
    }

    /**
     * @dev Overrides the fallback function to add admin logic
     */
    fallback() external payable override {
        if (msg.sender == _admin()) {
            bytes4 selector;
            assembly {
                selector := calldataload(0)
            }
            if (selector == bytes4(keccak256("upgradeTo(address)"))) {
                _upgradeTo(abi.decode(msg.data[4:], (address)));
                return;
            }
        }
        super._fallback();
    }

    function _upgradeTo(address newImplementation) internal {
        _setImplementation(newImplementation);
    }
}

/**
 * @title UUPSProxy
 * @dev A proxy that uses the UUPS pattern for upgrades
 */
contract UUPSProxy is Proxy {
    constructor(address initialImplementation, bytes memory data) payable {
        _setImplementation(initialImplementation);
        if (data.length > 0) {
            (bool success, ) = initialImplementation.delegatecall(data);
            require(success, "Proxy: initialization failed");
        }
    }
}
