const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Proxy Upgrade Patterns", function () {
  let owner, otherAccount;
  
  // Contract Factories
  let TransparentTokenV1, TransparentTokenV2, ProxyAdmin, TransparentProxy;
  let UUPSTokenV1, UUPSTokenV2, UUPSProxy;

  // Deployed Logic Contracts
  let transparentV1, transparentV2;
  let uupsV1, uupsV2;
  
  // This runs before each test, setting up a clean environment
  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();

    // Get all contract factories
    TransparentTokenV1 = await ethers.getContractFactory("TransparentTokenV1");
    TransparentTokenV2 = await ethers.getContractFactory("TransparentTokenV2");
    ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
    TransparentProxy = await ethers.getContractFactory("TransparentProxy");
    
    UUPSTokenV1 = await ethers.getContractFactory("UUPSTokenV1");
    UUPSTokenV2 = await ethers.getContractFactory("UUPSTokenV2");
    UUPSProxy = await ethers.getContractFactory("UUPSProxy");
    
    // Deploy the logic contracts
    transparentV1 = await TransparentTokenV1.deploy();
    transparentV2 = await TransparentTokenV2.deploy();
    await transparentV1.deployed();
    await transparentV2.deployed();
    
    uupsV1 = await UUPSTokenV1.deploy();
    uupsV2 = await UUPSTokenV2.deploy();
    await uupsV1.deployed();
    await uupsV2.deployed();
  });

  // --- Test Suite for the Transparent Proxy ---
  describe("Transparent Proxy Pattern", function () {
    let proxyAdmin, transparentProxy, tokenV1;
    
    beforeEach(async function() {
        // Deploy ProxyAdmin
        proxyAdmin = await ProxyAdmin.deploy();
        await proxyAdmin.deployed();

        // Prepare initialization data
        const initData = transparentV1.interface.encodeFunctionData("initialize", ["Transparent Token", "TT"]);
        
        // Deploy TransparentProxy and initialize it
        transparentProxy = await TransparentProxy.deploy(transparentV1.address, proxyAdmin.address, initData);
        await transparentProxy.deployed();
        
        // Create a contract instance to interact with the proxy
        tokenV1 = await ethers.getContractAt("TransparentTokenV1", transparentProxy.address);
    });

    it("should deploy and initialize correctly", async function () {
        expect(await tokenV1.name()).to.equal("Transparent Token");
        expect(await tokenV1.symbol()).to.equal("TT");
        expect(await tokenV1.version()).to.equal("Transparent V1 (Hybrid)");
        const ownerBalance = await tokenV1.balanceOf(owner.address);
        expect(ownerBalance).to.equal(ethers.utils.parseEther("1000000"));
    });

    it("should upgrade to V2 and allow calling new functions", async function () {
        // Upgrade the contract via the ProxyAdmin
        await proxyAdmin.upgrade(transparentProxy.address, transparentV2.address);

        // Create a new contract instance pointing to V2 ABI
        const tokenV2 = await ethers.getContractAt("TransparentTokenV2", transparentProxy.address);

        // Verify the new version
        expect(await tokenV2.version()).to.equal("Transparent V2 (Hybrid)");

        // Call the new 'burn' function from V2
        await tokenV2.burn(ethers.utils.parseEther("100"));
        
        // Check if the balance was updated correctly
        const ownerBalance = await tokenV2.balanceOf(owner.address);
        expect(ownerBalance).to.equal(ethers.utils.parseEther("999900"));
    });
    
    it("should preserve state (like owner) after upgrade", async function() {
        // Verify owner is correct in V1
        expect(await tokenV1.owner()).to.equal(owner.address);
        
        // Upgrade
        await proxyAdmin.upgrade(transparentProxy.address, transparentV2.address);
        const tokenV2 = await ethers.getContractAt("TransparentTokenV2", transparentProxy.address);
        
        // Verify owner is still the same in V2
        expect(await tokenV2.owner()).to.equal(owner.address);
    });
  });

  // --- Test Suite for the UUPS Proxy ---
  describe("UUPS Proxy Pattern", function () {
    let uupsProxy, tokenV1;
    
    beforeEach(async function() {
        // Prepare initialization data
        const initData = uupsV1.interface.encodeFunctionData("initialize", ["UUPS Token", "UT"]);

        // Deploy UUPSProxy and initialize
        uupsProxy = await UUPSProxy.deploy(uupsV1.address, initData);
        await uupsProxy.deployed();

        // Create a contract instance to interact with the proxy
        tokenV1 = await ethers.getContractAt("UUPSTokenV1", uupsProxy.address);
    });
    
    it("should deploy and initialize correctly", async function () {
        expect(await tokenV1.name()).to.equal("UUPS Token");
        expect(await tokenV1.symbol()).to.equal("UT");
        expect(await tokenV1.version()).to.equal("UUPS V1 (Hybrid)");
    });
    
    it("should upgrade to V2 and allow calling new pausable functions", async function () {
        // Upgrade the contract by calling the function ON THE PROXY
        await tokenV1.upgradeTo(uupsV2.address);
        
        const tokenV2 = await ethers.getContractAt("UUPSTokenV2", uupsProxy.address);
        
        // Verify the new version
        expect(await tokenV2.version()).to.equal("UUPS V2 (Hybrid)");
        
        // Call the new 'pause' function
        await tokenV2.pause();

        // Expect a transfer to fail now that it's paused
        await expect(
            tokenV2.transfer(otherAccount.address, ethers.utils.parseEther("1"))
        ).to.be.revertedWith("Pausable: paused");
        
        // Unpause and try again
        await tokenV2.unpause();
        await tokenV2.transfer(otherAccount.address, ethers.utils.parseEther("1"));
        
        expect(await tokenV2.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("1"));
    });
    
    it("should prevent a non-owner from upgrading", async function () {
        // Try to upgrade from an account that is not the owner
        await expect(
            tokenV1.connect(otherAccount).upgradeTo(uupsV2.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});