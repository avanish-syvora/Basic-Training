// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
@title ICoins
@notice Interface of the Coins contract which is am ERC 20
*/

interface ICoins{
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    function totalSupply() external view returns(uint256);
    function transfer(address recipient, uint256 amount) external returns(bool);
    function balanceOf(address account) external view returns(uint256);
    function approve(address spender, uint256 amount) external returns(bool);
    function allowance(address owner, address spender) external view returns(uint256);
    function transferFrom(address sender, address receiver, uint256 amount) external returns(bool);
}

/**
@title IAssets
@notice Interface for IAssets -- ERC721 Standard
*/
interface IAssets{
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed spender, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function balanceOf(address account) external view returns(uint256);
    //function transfer(address from, address to, uint256 amount) external returns(bool);
    function ownerOf(uint256 tokenId) external view returns(address owner);
    function approve(address operator, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns(address operator);
    function setApprovedForAll(address operator, bool approved) external;
    function isApprovedForAll(address owner, address operator) external view returns(bool);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

/**
@title Owner
@notice Control mech for only owner to have exclsive permisions
*/

abstract contract Owner{
    address private _owner;

    event OwnershipTransferred(address indexed prevOwner, address indexed newOwner);


    constructor(){
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }
    modifier onlyOwner(){
        require(msg.sender == _owner, "Owner: Caller is not the owner");
        _;
    }
    function owner() public view returns(address){
        return _owner;
    }
}



/**
@title Coins
@notice An ERC20 tokenn implementation for fungible coins
*/

contract Coins is ICoins, Owner{
    // State Var..
    uint8 private _decimals;
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor(){
        _name = "Coins";
        _symbol = "CN";
        _decimals = 18;
        uint256 initialSupply = 10000 * (10**_decimals);
        _mint(msg.sender, initialSupply);
    }
function name() public view returns(string memory){return _name;}

function symbol() public view returns(string memory){return _symbol;}

function totalSupply() public view returns(uint256){return _totalSupply;}

function decimals() public view returns(uint8){return _decimals;}

function balanceOf(address account) public view override returns(uint256) {return _balances[account];}

function allowance(address owner, address spender) public view override returns(uint256) {return _allowances[owner][spender];}




function transfer(address recipient, uint256 amount) public override returns(bool){
    _transfer(msg.sender, recipient, amount);
    return true;
}

function approve(address spender, uint256 amount) public override returns(bool){
    _approve(msg.sender, spender, amount);
    return true;
}

function transferFrom(address sender, address recipient, uint256 amount) public override returns(bool) {
    uint256 currentAllowance = _allowances[sender][msg.sender];
    require(currentAllowance >= amount, "Coins:transfer amount exceeds allowance");
    _transfer(sender, recipient, amount);
    _approve(sender, msg.sender, currentAllowance - amount);
    return true;
}

function ownerMint(address to, uint256 amount) public onlyOwner{
    _mint(to,amount);
}





function _transfer(address sender, address recipient, uint256 amount) internal{
    require(sender!= address(0) && recipient!= address(0) && amount > 0, "Coins: zero address transfer or zero amount");
    uint256 senderBalance = _balances[sender];
    require(senderBalance >= amount, "Coins: Transfer amount exceeds sender balance");
    _balances[sender] -= amount;
    _balances[recipient] += amount;
    emit Transfer(sender, recipient, amount);
}


function _approve(address owner, address spender, uint256 amount) internal{
    require(owner!= address(0) && spender != address(0),"Coins: Zero account approval");
    _allowances[owner][spender]= amount;
    emit Approval(owner, spender, amount);
}

function _mint(address account, uint256 amount) internal{
    require(account!= address(0),"Coins: minting to address(0)");
    _totalSupply += amount;
    _balances[account] += amount;
    emit Transfer(address(0), account, amount);
}
} 




/**
@title Assets
@notice Contract for non fungible ERC721 Assets
*/


contract Assets is IAssets{
    string private _name;
    string private _symbol;
    mapping(uint256 => address) private _owners; 
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    uint256 private _nextTokenId;
    ICoins public immutable coinContract;
    mapping(uint256 => uint256) public assetPrices;

    event PriceSet(uint256 indexed tokenId, uint256 price);
    event AssetExchanged(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price);

    constructor(address _coinContractAddress){
        _name = "Assets";
        _symbol = "AST";
        coinContract = ICoins(_coinContractAddress);
    }

    function name() public view returns(string memory) {return _name;}

    function symbol() public view returns(string memory) {return _symbol;}

    function balanceOf(address owner) public view override returns(uint256) {
        require(owner!= address(0),"Assets: Zero Address"); 
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view override returns(address) { 
        address owner = _owners[tokenId];
        require(owner!= address(0),"Assets: Non existent token");
        return owner;
    }

    function getApproved(uint256 tokenId) public view override returns(address){
        require(_owners[tokenId]!= address(0), "Assets: Non existent Token");
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address owner,address operator) public view override returns(bool){
        return _operatorApprovals[owner][operator];
    }

    function approve(address to,uint256 tokenId) public override{
        address owner = ownerOf(tokenId);
        require(to!= owner, "Assets: Approval to current owner");
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender), "Assets: Address not eligible to approve another address");
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function setApprovedForAll(address operator, bool approved) public override{
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(address from, address to, uint256 tokenId) public override{
        require(_isApprovedOrOwner(msg.sender, tokenId), "Assets: Neither Onwer nor approved");
        _transfer(from, to, tokenId);
    }
    
    function mint() public{
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
    }

    function setPrice(uint256 tokenId, uint256 price) public{
        require(ownerOf(tokenId)==msg.sender, "Asset:Only Asset owner can set the price");
        require(price > 0, "Asset: Price must be greater than zero");
        assetPrices[tokenId] = price;
        emit PriceSet(tokenId, price);
    }

    function exchange(uint256 tokenId) public{
        uint256 price = assetPrices[tokenId];
        require(price>0,"Price not set for this token");
        address assetOwner = ownerOf(tokenId);
        require(assetOwner != msg.sender, "Buyer cant be the owner");
        coinContract.transferFrom(msg.sender, assetOwner, price);
        _transfer(assetOwner, msg.sender, tokenId);

        emit AssetExchanged(tokenId, assetOwner, msg.sender, price);

    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "Assets: Incorrect TokenId");
        require(to != address(0), "Asstes: Transfer to the zero address");
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0),"Assets: minting to zero address");
        require(_owners[tokenId] == address(0), "Assets: Token Already minted");
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns(bool) {
        address owner = ownerOf(tokenId);
        return(spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
}   



