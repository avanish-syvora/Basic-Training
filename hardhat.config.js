require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config(); // Add this line

const DEPLOYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "";

module.exports = {
  solidity: "0.8.20",
  networks: {
    chainA: {
      url: process.env.CHAIN_A_RPC_URL || "http://127.0.0.1:8545",
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    chainB: {
      url: process.env.CHAIN_B_RPC_URL || "http://127.0.0.1:9545",
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
  },
};