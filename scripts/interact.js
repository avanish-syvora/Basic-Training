const { ethers } = require("hardhat");
require('dotenv').config();

const BRIDGE_ADDRESS_A = process.env.CHAIN_A_BRIDGE_ADDRESS;
const TOKEN_ADDRESS_A = process.env.CHAIN_A_TOKEN_ADDRESS;
const TOKEN_ADDRESS_B = process.env.CHAIN_B_TOKEN_ADDRESS;
const RPC_URL_B = process.env.CHAIN_B_RPC_URL;

async function main() {
    // --- Step 1: Configuration check ---
    if (!BRIDGE_ADDRESS_A || !TOKEN_ADDRESS_A || !TOKEN_ADDRESS_B || !RPC_URL_B) {
        console.error("Error: Missing address or RPC URL in .env file.");
        console.error("Please make sure CHAIN_A_BRIDGE_ADDRESS, CHAIN_A_TOKEN_ADDRESS, CHAIN_B_TOKEN_ADDRESS, and CHAIN_B_RPC_URL are set.");
        process.exit(1);
    }
    
    const [owner] = await ethers.getSigners();
    const receiverOnChainB = owner.address;

    const bridgeAbi = [ "function bridgeOut(address recipientOnOtherChain, uint256 amount) external" ];
    const tokenAbi = [ "function approve(address spender, uint256 amount) external returns (bool)", "function balanceOf(address) view returns (uint256)" ];

    if (hre.network.name === 'chainA') {
        console.log(`Interacting on Chain A with account: ${owner.address}`);
        
        const bridgeA = new ethers.Contract(BRIDGE_ADDRESS_A, bridgeAbi, owner);
        const tokenA = new ethers.Contract(TOKEN_ADDRESS_A, tokenAbi, owner);

        const amountToBridge = ethers.parseEther("100");

        console.log(`\nBalance before bridging: ${ethers.formatEther(await tokenA.balanceOf(owner.address))} UTK`);
        console.log(`Bridging ${ethers.formatEther(amountToBridge)} UTK to ${receiverOnChainB} on Chain B...`);
        
        // --- Action on Chain A ---
        console.log("Step 1: Approving bridge to spend tokens...");
        const approveTx = await tokenA.approve(await bridgeA.getAddress(), amountToBridge);
        await approveTx.wait();
        console.log("Approval successful.");

        console.log("Step 2: Calling bridgeOut function...");
        const bridgeTx = await bridgeA.bridgeOut(receiverOnChainB, amountToBridge);
        await bridgeTx.wait();
        
        console.log("\n BridgeOut transaction successful on Chain A!");
        console.log(`Balance after bridging on Chain A: ${ethers.formatEther(await tokenA.balanceOf(owner.address))} UTK`);
        console.log("\nWaiting for the relayer to process the transaction on Chain B (approx. 5 seconds)...");
        
        // Relayer ko kaam karne ke liye 5 second ka time de rahe hain.
        await new Promise(resolve => setTimeout(resolve, 5000));

        // --- Step 3: Verification on Chain B ---
        const providerB = new ethers.JsonRpcProvider(RPC_URL_B);
        const tokenB = new ethers.Contract(TOKEN_ADDRESS_B, tokenAbi, providerB);

        const finalBalanceB = await tokenB.balanceOf(receiverOnChainB);
        console.log(`\n Verification on Chain B complete!`);
        console.log(`   Receiver's new balance on Chain B: ${ethers.formatEther(finalBalanceB)} UTK`);

        
    } else {
        console.log("This script is configured to bridge from Chain A. Run with '--network chainA'");
    }
}

main().catch(e => { console.error(e); process.exit(1); });

