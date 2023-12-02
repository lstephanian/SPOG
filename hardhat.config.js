require('@nomicfoundation/hardhat-toolbox');

// NEVER record important private keys in your code - this is for demo purposes
const PRIVATE_KEY = process.env.PRIV_KEY;
const ARBISCAN_API_KEY = process.env.ETHERSCAN_KEY;
const ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY = '';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.20',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    arbitrumSepolia: {
      url: 'https://sepolia-rollup.arbitrum.io/rpc',
      chainId: 421614,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: ARBISCAN_API_KEY,
    },
    customChains: [
      {
          network: "arbitrumSepolia",
          chainId: 421614,
          urls: {
              apiURL: "https://api-sepolia.arbiscan.io/api",
              browserURL: "https://sepolia.arbiscan.io/",
          },
      },
    ],
  },
  sourcify: {
    enabled: true
  },
};

