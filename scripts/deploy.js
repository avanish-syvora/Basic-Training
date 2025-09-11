const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const relayerAddress = deployer.address;

  console.log("------------:)))------------------");
  console.log(`Deploying on network: ${hre.network.name}`);
  console.log(`Deployer/Relayer address: ${deployer.address}`);
  console.log("---:)) -----------------------------");

  //  Deploying UniversalToken
  const UniversalToken = await ethers.getContractFactory("UniversalToken");
  const initialSupply = ethers.parseEther("1000000");
  const token = await UniversalToken.deploy("Universal Token", "UTK", deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  await token.mint(deployer.address, initialSupply); 
  console.log(`UniversalToken (UTK) deployed to: ${tokenAddress}`);
  console.log(`Minted ${ethers.formatEther(initialSupply)} UTK to deployer.`);

  // 2. Deploy Bridge
  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(tokenAddress, relayerAddress, deployer.address);
  await bridge.waitForDeployment();
  const bridgeAddress = await bridge.getAddress();
  console.log(`Bridge deployed to: ${bridgeAddress}`);

  // 3. Transfer ownership of the Token to the Bridge
  console.log("Transferring token ownership to the Bridge...");
  const tx = await token.transferOwnership(bridgeAddress);
  await tx.wait();
  console.log("Ownership transferred successfully.");

  console.log("\n--- Deployment Complete ---");
  console.log("BHai Remember to update .env file with these addresses!\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});