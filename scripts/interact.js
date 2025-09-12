const { ethers } = require("hardhat");
require('dotenv').config();


const CHAIN_A_BRIDGE_ADDRESS = process.env.CHAIN_A_BRIDGE_ADDRESS;
const CHAIN_A_TOKEN_ADDRESS = process.env.CHAIN_A_TOKEN_ADDRESS;
const CHAIN_B_TOKEN_ADDRESS = process.env.CHAIN_B_TOKEN_ADDRESS;
const CHAIN_B_RPC_URL = "https://ethereum-hoodi-rpc.publicnode.com";

async function main() {
    // Script chalane se pehle check kar rahe hain ki .env file mein sab kuch hai ya nahi
    if (!CHAIN_A_BRIDGE_ADDRESS || !CHAIN_A_TOKEN_ADDRESS || !CHAIN_B_TOKEN_ADDRESS || !CHAIN_B_RPC_URL) {
        console.error(" Error: Aapke .env file mein address ya RPC URL missing hai. Please check karein.");
        process.exit(1);
    }
    
    // Signer (jo transaction bhej raha hai) aur Receiver (jisko tokens milenge) dono ek hi account honge
    const [owner] = await ethers.getSigners();
    const receiverOnChainB = owner.address;

    const bridgeAbi = [ "function bridgeOut(address recipientOnOtherChain, uint256 amount) external" ];
    const tokenAbi = [ 
        "function approve(address spender, uint256 amount) external returns (bool)", 
        "function balanceOf(address) view returns (uint256)" 
    ];

    if (hre.network.name === 'baseSepolia') {
        console.log(`Interacting on Chain A (baseSepolia) with account: ${owner.address}`);
        
        const bridgeA = new ethers.Contract(CHAIN_A_BRIDGE_ADDRESS, bridgeAbi, owner);
        const tokenA = new ethers.Contract(CHAIN_A_TOKEN_ADDRESS, tokenAbi, owner);


        const amountToBridge = ethers.utils.parseEther("100");

        console.log(`\nBalance on Chain A before bridging: ${ethers.utils.formatEther(await tokenA.balanceOf(owner.address))} UTK`);
        console.log(`Bridging ${ethers.utils.formatEther(amountToBridge)} UTK to ${receiverOnChainB} on Chain B (hoodiTestnet)...`);
        
        // Step 1: Bridge contract ko tokens spend karne ke liye approve karna
        console.log("Step 1: Approving bridge to spend tokens...");
        const approveTx = await tokenA.approve(bridgeA.address, amountToBridge); // ethers v5 syntax: .address
        await approveTx.wait();
        console.log("Approval successful.");

   
        console.log("Step 2: Calling bridgeOut function...");
        const bridgeTx = await bridgeA.bridgeOut(receiverOnChainB, amountToBridge);
        await bridgeTx.wait();
        
        console.log("\n BridgeOut transaction successful on Chain A!");
        console.log(`Balance on Chain A after bridging: ${ethers.utils.formatEther(await tokenA.balanceOf(owner.address))} UTK`);
        
        console.log("\n Waiting for the relayer to process the transaction... (5 seconds)");
        await new Promise(resolve => setTimeout(resolve, 5000)); // Relayer ko kaam karne ka time de rahe hain

        // --- Verification on Chain B ---
        console.log("\nVerifying balance on Chain B (hoodiTestnet)...");
        const providerB = new ethers.providers.JsonRpcProvider(CHAIN_B_RPC_URL); // ethers v5 syntax
        const tokenB = new ethers.Contract(CHAIN_B_TOKEN_ADDRESS, tokenAbi, providerB);

        const initialBalanceB = await tokenB.balanceOf(receiverOnChainB);
        const finalBalanceB = ethers.utils.formatEther(initialBalanceB);

        console.log(`\n Verification on Chain B complete!`);
        console.log(`Receiver's new balance on Chain B is: ${finalBalanceB} UTK`);

    } else {
        console.warn("This script is configured to run on 'baseSepolia'. Please use '--network baseSepolia'");
    }
}

main().catch(e => { 
    console.error("An error occurred:", e); 
    process.exit(1); 
});

