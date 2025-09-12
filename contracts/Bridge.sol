// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./UTK.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bridge is Ownable {
    IUniversalToken public immutable token;
    address public relayer;


    uint256 public nonce;
    mapping(uint256 => bool) public processedNonces;

    event TokensBridged(
        address from,
        address to,
        uint256 amount,
        uint256 nonce
    );

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Bridge: Caller is not the relayer");
        _;
    }

    constructor(address tokenAddress, address relayerAddress, address initialOwner) Ownable(initialOwner) {
        token = IUniversalToken(tokenAddress);
        relayer = relayerAddress;
    }

    /**
     * @notice Tokens ko doosri chain par bhejne ke liye.
     * @dev User have to approve the bridge contract first
     */
    function bridgeOut(address recipientOnOtherChain, uint256 amount) external {
        require(amount > 0, "Bridge: Amount must be > 0");
        token.burnFrom(msg.sender, amount);

        // Event emit -- relayer sunega
        emit TokensBridged(msg.sender, recipientOnOtherChain, amount, nonce);
        nonce++;
    }

    /**
     * @notice Doosri chain se aaye tokens ko is chain par mint karne ke liye.
     * @dev Sirf relayer hi is function ko call kar sakta hai.
     */
    function bridgeIn(address to, uint256 amount, uint256 eventNonce) external onlyRelayer {
        require(!processedNonces[eventNonce], "Bridge: Transfer already processed");
        
        processedNonces[eventNonce] = true;
        
        token.mint(to, amount);
    }
    
    function setRelayer(address newRelayerAddress) external onlyOwner {
        relayer = newRelayerAddress;
    }
}



interface IUniversalToken {
    function mint(address to, uint256 amount) external;
    function burnFrom(address from, uint256 amount) external;
    function setBridge(address bridgeAddress) external;
    function transferOwnership(address newOwner) external;
}