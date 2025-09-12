/**
 * @title CustomInitializable
 */
abstract contract CustomInitializable {
    bool private _initialized;

    modifier customInitializer() {
        require(!_initialized, "CustomInitializable: contract is already initialized");
        _;
        _initialized = true;
    }
}

/**
 * @title CustomOwnableUpgradeable
 * @dev Ownership contract using CustomInitializable to initialize only once
 */
abstract contract CustomOwnableUpgradeable is CustomInitializable {
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function __Ownable_init() internal customInitializer {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }
}