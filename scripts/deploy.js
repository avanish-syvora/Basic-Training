const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const relayerAddress = deployer.address;

  console.log("------------:)))------------------");
  console.log(`Deploying on network: ${hre.network.name}`);
  console.log(`Deployer/Relayer address: ${deployer.address}`);
  console.log("---:)) -----------------------------");

  const UniversalToken = await ethers.getContractFactory("UniversalToken");
  const initialSupply = ethers.utils.parseEther("1000000");
  
  const token = await UniversalToken.deploy("Universal Token", "UTK", deployer.address);

  await token.deployed(); 

  const tokenAddress = token.address; 
  
  await token.mint(deployer.address, initialSupply);
  console.log(`UniversalToken (UTK) deployed to: ${tokenAddress}`);
  console.log(`Minted ${ethers.utils.formatEther(initialSupply)} UTK to deployer.`);

  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(tokenAddress, relayerAddress, deployer.address);
  // FIX 3: .waitForDeployment() -> .deployed()
  await bridge.deployed(); 
  // FIX 4: .getAddress() -> .address
  const bridgeAddress = bridge.address; 
  console.log(`Bridge deployed to: ${bridgeAddress}`);

  console.log("Transferring token ownership to the Bridge...");
  const tx = await token.transferOwnership(bridgeAddress);
  await tx.wait();
  console.log("Ownership transferred successfully.");

  console.log("\n--- Deployment Complete ---");
  console.log("Remember to update your .env file with these addresses!\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});