const { ethers } = require("ethers");
require('dotenv').config();

const config = {
  chainA: {
    rpcUrl: process.env.CHAIN_A_RPC_URL,
    bridgeAddress: process.env.CHAIN_A_BRIDGE_ADDRESS,
  },
  chainB: {
    rpcUrl: process.env.CHAIN_B_RPC_URL,
    bridgeAddress: process.env.CHAIN_B_BRIDGE_ADDRESS,
  },
  relayerPrivateKey: process.env.RELAYER_PRIVATE_KEY,
};

const bridgeAbi = [
  "event TokensBridged(address from, address to, uint256 amount, uint256 nonce)",
  "function bridgeIn(address to, uint256 amount, uint256 eventNonce)",
  "function processedNonces(uint256) view returns (bool)"
];

async function main() {
  const providerA = new ethers.JsonRpcProvider(config.chainA.rpcUrl);
  const providerB = new ethers.JsonRpcProvider(config.chainB.rpcUrl);
  const relayerWallet = new ethers.Wallet(config.relayerPrivateKey);
  
  const signerA = relayerWallet.connect(providerA);
  const signerB = relayerWallet.connect(providerB);

  const bridgeA = new ethers.Contract(config.chainA.bridgeAddress, bridgeAbi, signerA);
  const bridgeB = new ethers.Contract(config.chainB.bridgeAddress, bridgeAbi, signerB);

  console.log(" :)) Haan bhyyii Off-chain relayer started. Listening for token bridge events...");

  // Listen on Chain A, UTK to Chain B
  bridgeA.on("TokensBridged", async (from, to, amount, nonce) => {
    console.log(`\n :) [Chain A -> Chain B] Bridge Event Detected!!`);
    console.log(` From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Amount: ${ethers.formatEther(amount)} UTK`);
    console.log(`   Nonce: ${nonce.toString()}`);

    try {
      const isProcessed = await bridgeB.processedNonces(nonce);
      if (isProcessed) {
          console.log(`[Chain B] Nonce ${nonce} already processed. Skipping.`);
          return;
      }
      
      console.log("[Chain B] Relaying mint transaction...");
      const tx = await bridgeB.bridgeIn(to, amount, nonce);
      await tx.wait();
      console.log(`[Chain B]  Successfully Minted! Tx: ${tx.hash}`);

    } catch (error) {
        console.error("[Chain B]  Error relaying transaction:", error.message);
    }
  });

  // Listen on Chain B, UTK to Chain A
  bridgeB.on("TokensBridged", async (from, to, amount, nonce) => {
    console.log(`\n [Chain B -> Chain A] Bridge Event Detected!`);
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(` Amount: ${ethers.formatEther(amount)} UTK`);
    console.log(`Nonce: ${nonce.toString()}`);

    try {
        const isProcessed = await bridgeA.processedNonces(nonce);
        if (isProcessed) {
            console.log(`[Chain A] Nonce ${nonce} already processed. Skipping.`);
            return;
        }

        console.log("[Chain A] Relaying mint transaction...");
        const tx = await bridgeA.bridgeIn(to, amount, nonce);
        await tx.wait();
        console.log(`[Chain A]  Successfully Minted! Tx: ${tx.hash}`);
        
    } catch (error) {
        console.error("[Chain A]  Error relaying transaction:", error.message);
    }
  });
}

main().catch(error => {
  console.error("Relayer encountered an errorrr:", error);
  process.exit(1);
});