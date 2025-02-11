import { useUserProviderAndSigner } from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Account, Header, NetworkDisplay, FaucetHint, NetworkSwitch, Faucet } from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";

import { getRPCPollTime, Web3ModalSetup } from "./helpers";
import { Homepage } from "./views";
import { ContractUI } from "./views";
import { useStaticJsonRPC } from "./hooks";
import { Col, Row } from "antd";
import { GithubFilled, HeartFilled } from "@ant-design/icons";

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Alchemy.com & Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.mainnet;

const NETWORKCHECK = true;
const USE_BURNER_WALLET = process.env.REACT_APP_BURNER_WALLET ?? false;
const USE_NETWORK_SELECTOR = false;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://dogechain.ankr.com",
  `https://rpc.dogechain.dog`,
  "https://rpc03-sg.dogechain.dog",
];

function App() {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);

  const mainnetProvider = useStaticJsonRPC(providers);

  const mainnetProviderPollingTime = getRPCPollTime(mainnetProvider);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  //const price = useExchangeEthPrice(targetNetwork, mainnetProvider, mainnetProviderPollingTime);
  const price = 0.11;

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [loadedContract, setLoadedContract] = useState(null);
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header>
        {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
        <div className="account-info" style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flex: 1 }}>
            {USE_NETWORK_SELECTOR && (
              <div style={{ marginRight: 20 }}>
                <NetworkSwitch
                  networkOptions={networkOptions}
                  selectedNetwork={selectedNetwork}
                  setSelectedNetwork={setSelectedNetwork}
                />
              </div>
            )}
            <Account
              useBurner={USE_BURNER_WALLET}
              address={address}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
            />
          </div>
        </div>
      </Header>
      {localProvider?._network?.chainId === 31337 && (
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
      )}
      {userSigner && (
        <NetworkDisplay
          NETWORKCHECK={NETWORKCHECK}
          localChainId={localChainId}
          selectedChainId={selectedChainId}
          targetNetwork={targetNetwork}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
        />
      )}
      <Switch>
        <Route exact path="/">
          <Homepage
            localProvider={localProvider}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            targetNetwork={targetNetwork}
            onUpdateNetwork={setSelectedNetwork}
            setLoadedContract={setLoadedContract}
            selectedChainId={selectedChainId}
          />
        </Route>
        <Route exact path="/:urlContractAddress/:urlNetworkName?">
          <ContractUI
            customContract={loadedContract}
            userSigner={userSigner}
            localProvider={localProvider}
            mainnetProvider={mainnetProvider}
            blockExplorer={targetNetwork.blockExplorer}
            setLoadedContract={setLoadedContract}
            setSelectedNetwork={setSelectedNetwork}
            loadWeb3Modal={loadWeb3Modal}
          />
        </Route>
      </Switch>
      <div className="site-footer">
        <div className="footer-items">
          <p>
            <GithubFilled />{" "}
            <a href="https://github.com/carletex/abi.ninja" target="_blank" rel="noreferrer">
              Fork me
            </a>
          </p>
          <p>|</p>
          <p>
            Built with <HeartFilled /> at 🏰{" "}
            <a href="https://buidlguidl.com/" target="_blank" rel="noreferrer">
              BuidlGuidl
            </a>, Forked with <HeartFilled /> By <a href="https://t.me/Poodogechain">PooDoge</a>
          </p>
        </div>
      </div>
      <div
        className="eth-info-faucet"
        style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}
      >
        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {faucetAvailable ? (
              <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
            ) : (
              ""
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
