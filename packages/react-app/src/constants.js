export const RPC_POLL_TIME = 30000;

// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = process.env.REACT_APP_INFURA_KEY ?? "460f40a260564ac4a4f4b3fffb032dad";

const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.REACT_APP_POLYGONSCAN_API_KEY;

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "0b58206a-f3c0-4701-a62f-73c7243e8c77";

export const ALCHEMY_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://127.0.0.1:8545/",
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 2000,
    rpcUrl: `https://dogechain.ankr.com`,
    blockExplorer: "https://explorer.dogechain.dog/",
    etherscanEndpoint: "https://explorer.dogechain.dog/",
    apiKey: ETHERSCAN_API_KEY,
  },
  // devnetArbitrum: {
  //   name: "devnetArbitrum",
  //   color: "#28a0f0",
  //   chainId: 421612,
  //   blockExplorer: "https://nitro-devnet-explorer.arbitrum.io/",
  //   rpcUrl: "https://nitro-devnet.arbitrum.io/rpc",
  // },
  // localAvalanche: {
  //   name: "localAvalanche",
  //   color: "#666666",
  //   chainId: 43112,
  //   blockExplorer: "",
  //   rpcUrl: `http://localhost:9650/ext/bc/C/rpc`,
  //   gasPrice: 225000000000,
  // },
  // fujiAvalanche: {
  //   name: "fujiAvalanche",
  //   color: "#666666",
  //   chainId: 43113,
  //   blockExplorer: "https://cchain.explorer.avax-test.network/",
  //   rpcUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
  //   gasPrice: 225000000000,
  // },
  // mainnetAvalanche: {
  //   name: "mainnetAvalanche",
  //   color: "#666666",
  //   chainId: 43114,
  //   blockExplorer: "https://cchain.explorer.avax.network/",
  //   rpcUrl: `https://api.avax.network/ext/bc/C/rpc`,
  //   gasPrice: 225000000000,
  // },
  // testnetHarmony: {
  //   name: "testnetHarmony",
  //   color: "#00b0ef",
  //   chainId: 1666700000,
  //   blockExplorer: "https://explorer.pops.one/",
  //   rpcUrl: `https://api.s0.b.hmny.io`,
  //   gasPrice: 1000000000,
  // },
  // mainnetHarmony: {
  //   name: "mainnetHarmony",
  //   color: "#00b0ef",
  //   chainId: 1666600000,
  //   blockExplorer: "https://explorer.harmony.one/",
  //   rpcUrl: `https://api.harmony.one`,
  //   gasPrice: 1000000000,
  // },
  // fantom: {
  //   name: "fantom",
  //   color: "#1969ff",
  //   chainId: 250,
  //   blockExplorer: "https://ftmscan.com/",
  //   rpcUrl: `https://rpcapi.fantom.network`,
  //   gasPrice: 1000000000,
  // },
  // testnetFantom: {
  //   name: "testnetFantom",
  //   color: "#1969ff",
  //   chainId: 4002,
  //   blockExplorer: "https://testnet.ftmscan.com/",
  //   rpcUrl: `https://rpc.testnet.fantom.network`,
  //   gasPrice: 1000000000,
  //   faucet: "https://faucet.fantom.network/",
  // },
  // moonbeam: {
  //   name: "moonbeam",
  //   color: "#53CBC9",
  //   chainId: 1284,
  //   blockExplorer: "https://moonscan.io",
  //   rpcUrl: "https://rpc.api.moonbeam.network",
  // },
  // moonriver: {
  //   name: "moonriver",
  //   color: "#53CBC9",
  //   chainId: 1285,
  //   blockExplorer: "https://moonriver.moonscan.io/",
  //   rpcUrl: "https://rpc.api.moonriver.moonbeam.network",
  // },
  // moonbaseAlpha: {
  //   name: "moonbaseAlpha",
  //   color: "#53CBC9",
  //   chainId: 1287,
  //   blockExplorer: "https://moonbase.moonscan.io/",
  //   rpcUrl: "https://rpc.api.moonbase.moonbeam.network",
  //   faucet: "https://discord.gg/SZNP8bWHZq",
  // },
  // moonbeamDevNode: {
  //   name: "moonbeamDevNode",
  //   color: "#53CBC9",
  //   chainId: 1281,
  //   blockExplorer: "https://moonbeam-explorer.netlify.app/",
  //   rpcUrl: "http://127.0.0.1:9933",
  // },
};

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};
