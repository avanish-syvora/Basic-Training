const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("----------- ;) ---");

  // --- TRANSPARENT PROXY FLOW ---
  console.log("Deploying and Upgrading Transparent Proxy...");

  // 1. Deploy Logic V1
  const TransparentTokenV1 = await ethers.getContractFactory("TransparentTokenV1");
  const transparentV1 = await TransparentTokenV1.deploy();
  await transparentV1.waitForDeployment();
  console.log("TransparentTokenV1 (Logic) deployed to:", await transparentV1.getAddress());

  // 2. Deploy ProxyAdmin
  const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  const proxyAdmin = await ProxyAdmin.deploy();
  await proxyAdmin.waitForDeployment();
  console.log("ProxyAdmin deployed to:", await proxyAdmin.getAddress());

  // 3. Deploy TransparentProxy and Initialize
  const initData = transparentV1.interface.encodeFunctionData("initialize", ["Transparent Token", "TT"]);
  const TransparentProxy = await ethers.getContractFactory("TransparentProxy");
  const transparentProxy = await TransparentProxy.deploy(await transparentV1.getAddress(), await proxyAdmin.getAddress(), initData);
  await transparentProxy.waitForDeployment();
  console.log("TransparentProxy deployed to:", await transparentProxy.getAddress());

  // 4. Interact with V1
  const transparentTokenV1 = await ethers.getContractAt("TransparentTokenV1", await transparentProxy.getAddress());
  console.log("Token version (via Transparent Proxy):", await transparentTokenV1.version());
  
  // 5. Deploy Logic V2
  const TransparentTokenV2 = await ethers.getContractFactory("TransparentTokenV2");
  const transparentV2 = await TransparentTokenV2.deploy();
  await transparentV2.waitForDeployment();
  console.log("TransparentTokenV2 (Logic) deployed to:", await transparentV2.getAddress());

  // 6. Upgrade the proxy via the ProxyAdmin
  console.log("Upgrading Transparent Proxy to V2...");
  await proxyAdmin.upgrade(await transparentProxy.getAddress(), await transparentV2.getAddress());

  // 7. Interact with V2
  const transparentTokenV2 = await ethers.getContractAt("TransparentTokenV2", await transparentProxy.getAddress());
  console.log("Token version after upgrade:", await transparentTokenV2.version());
  console.log("Calling V2's burn function...");
  // Note: We use parseEther because our custom ERC20 has 18 decimals.
  await transparentTokenV2.burn("1000000000000000000"); // Burning 1 token
  console.log("Burn successful!");

  console.log("\n---:0 -----------------------\n");

  // --- UUPS PROXY FLOW ---
  console.log("Deploying and Upgrading UUPS Proxy...");
  
  // 1. Deploy Logic V1 for UUPS
  const UUPSTokenV1 = await ethers.getContractFactory("UUPSTokenV1");
  const uupsV1 = await UUPSTokenV1.deploy();
  await uupsV1.waitForDeployment();
  console.log("UUPSTokenV1 (Logic) deployed to:", await uupsV1.getAddress());

  // 2. Deploy UUPSProxy and Initialize
  const initDataUUPS = uupsV1.interface.encodeFunctionData("initialize", ["UUPS Token", "UT"]);
  const UUPSProxy = await ethers.getContractFactory("UUPSProxy");
  const uupsProxy = await UUPSProxy.deploy(await uupsV1.getAddress(), initDataUUPS);
  await uupsProxy.waitForDeployment();
  console.log("UUPSProxy deployed to:", await uupsProxy.getAddress());

  // 3. Interact with V1
  const uupsTokenV1 = await ethers.getContractAt("UUPSTokenV1", await uupsProxy.getAddress());
  console.log("Token version (via UUPS Proxy):", await uupsTokenV1.version());
  
  // 4. Deploy Logic V2
  const UUPSTokenV2 = await ethers.getContractFactory("UUPSTokenV2");
  const uupsV2 = await UUPSTokenV2.deploy();
  await uupsV2.waitForDeployment();
  console.log("UUPSTokenV2 (Logic) deployed to:", await uupsV2.getAddress());

  // 5. Upgrade the proxy BY CALLING THE PROXY ITSELF
  console.log("Upgrading UUPS Proxy to V2...");
  // We call upgradeTo on the proxy instance, which delegatecalls to the logic (V1).
  await uupsTokenV1.upgradeTo(await uupsV2.getAddress());

  // 6. Interact with V2
  const uupsTokenV2 = await ethers.getContractAt("UUPSTokenV2", await uupsProxy.getAddress());
  console.log("Token version after upgrade:", await uupsTokenV2.version());
  console.log("Calling V2's pause function...");
  await uupsTokenV2.pause();
  console.log("Pause successful!");

  console.log("\n----:) -------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

