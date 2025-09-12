require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const HOODI_RPC_URL = process.env.HOODI_RPC_URL || "";
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || "";

module.exports = {
  solidity: "0.8.20",
  networks: {

    localhost: {
      url: "http://127.0.0.1:8545",
    },

    hoodiTestnet: {
      url: HOODI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 560048,
    },
    baseSepolia: {
      url: BASE_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 84532,
    },
  },
};
