import React, { useEffect, useState } from "react";
import { AddressInput } from "../components";
import { Button, message, Select, Collapse } from "antd";
import TextArea from "antd/es/input/TextArea";
import { NETWORKS } from "../constants";
import { useHistory } from "react-router-dom";
import useBodyClass from "../hooks/useBodyClass";
import { loadContractEtherscan } from "../helpers/loadContractEtherscan";
import { loadContractRaw } from "../helpers/loadContractRaw";

const { Panel } = Collapse;

const quickAccessContracts = [
  {
    name: "Poo Doge Contract",
    address: "0x3f4aE49EABEa4cc250a640eEa788a321C0AE7EB2",
  },
  {
    name: "Kibbleswap Router",
    address: "0x6258c967337D3faF0C2ba3ADAe5656bA95419d5f",
  },
  {
    name: "Dogeswap Router",
    address: "0xa4ee06ce40cb7e8c04e127c1f7d3dfb7f7039c81",
  },
  {
    name: "Yodeswap Router",
    address: "0xAaA04462e35f3e40D798331657cA015169e005d7",
  },
];

function Homepage({
  userSigner,
  mainnetProvider,
  targetNetwork,
  onUpdateNetwork,
  setLoadedContract,
  localProvider,
  selectedChainId,
}) {
  const [verifiedContractAddress, setVerifiedContractAddress] = useState("");
  const [abiContractAddress, setAbiContractAddress] = useState("");
  const [contractAbi, setContractAbi] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(targetNetwork);
  const [isLoadingContract, setIsLoadingContract] = useState(false);
  const history = useHistory();

  useBodyClass(`path-index`);

  useEffect(() => {
    const storedNetwork = sessionStorage.getItem("selectedNetwork");
    if (storedNetwork) {
      setSelectedNetwork(NETWORKS[storedNetwork]);
      onUpdateNetwork(storedNetwork);
    }
    // Dont want to re-run on selected network change.
    // eslint-disable-next-line
  }, [onUpdateNetwork]);

  const loadVerifiedContract = async (address = null) => {
    const queryContractAddress = address ?? verifiedContractAddress;

    let contract;
    try {
      const providerOrSigner = userSigner ?? localProvider;
      contract = await loadContractEtherscan(queryContractAddress, selectedNetwork, providerOrSigner);
    } catch (e) {
      message.error(e.message);
      return;
    }

    setLoadedContract(contract);
    return contract.address;
  };

  const loadContractAbi = async () => {
    let contract;
    try {
      const providerOrSigner = userSigner ?? localProvider;
      contract = await loadContractRaw(abiContractAddress, contractAbi, selectedNetwork, providerOrSigner);
    } catch (e) {
      message.error(e.message);
      return;
    }

    setLoadedContract(contract);
    return contract.address;
  };

  const loadContract = async (type, address = null) => {
    if (selectedChainId && selectedNetwork.chainId !== selectedChainId) {
      message.error(`Please switch your wallet to ${selectedNetwork.name}.`);
      return;
    }

    setIsLoadingContract(true);

    let contractAddress;
    switch (type) {
      case "abi":
        contractAddress = await loadContractAbi();
        break;
      case "verified":
        if (address) {
          contractAddress = await loadVerifiedContract(address);
        } else {
          contractAddress = await loadVerifiedContract();
        }
        break;
      default:
        console.error("wrong type", type);
    }

    setIsLoadingContract(false);

    if (contractAddress) {
      if (type === "abi") {
        const queryParams = new URLSearchParams();
        const minifiedAbi = contractAbi.replace(/\s+/g, "");
        queryParams.append("abi", encodeURIComponent(minifiedAbi));

        history.push(`/${contractAddress}/${selectedNetwork.name}?${queryParams.toString()}`);
      } else {
        history.push(`/${contractAddress}/${selectedNetwork.name}`);
      }
    }
  };

  const networkSelect = (
    <Select
      value={selectedNetwork.name}
      style={{ textAlign: "left", width: 170, fontSize: 30 }}
      onChange={value => {
        if (selectedNetwork.chainId !== NETWORKS[value].chainId) {
          sessionStorage.setItem("selectedNetwork", value);
          setSelectedNetwork(NETWORKS[value]);
          onUpdateNetwork(value);
        }
      }}
    >
      {Object.entries(NETWORKS).map(([name, network]) => (
        <Select.Option key={name} value={name}>
          <span style={{ color: network.color }}>{name}</span>
        </Select.Option>
      ))}
    </Select>
  );

  return (
    <div className="index-container">
      <div className="logo">
        <img src="/ninjalogo_inv.png" alt="logo" />
      </div>
      <div className="lead-text">
        <p>Interact with any contract on Dogechain.</p>
      </div>
      <div className="network-selector center">
        <p>{networkSelect}</p>
      </div>

      <Collapse defaultActiveKey={["1"]} className="abi-ninja-options" accordion>
        <Panel header="Verified Contract Address" key="1">
          <div className="form-item">
            <AddressInput
              value={verifiedContractAddress}
              placeholder={`Verified contract address on ${selectedNetwork.name}`}
              ensProvider={mainnetProvider}
              size="large"
              onChange={setVerifiedContractAddress}
            />
          </div>
          <div className="options-actions">
            <Button
              type="primary"
              size="large"
              onClick={() => loadContract("verified")}
              loading={isLoadingContract}
              block
            >
              Load Contract
            </Button>
          </div>
        </Panel>
        <Panel header="Address + ABI" key="2">
          <div className="form-item">
            <AddressInput
              value={abiContractAddress}
              placeholder={`Contract address on ${selectedNetwork.name}`}
              ensProvider={mainnetProvider}
              size="large"
              onChange={setAbiContractAddress}
            />
          </div>
          <div className="form-item">
            <TextArea
              style={{ height: 120 }}
              value={contractAbi}
              size="large"
              placeholder="Contract ABI (json format)"
              onChange={e => {
                setContractAbi(e.target.value);
              }}
            />
          </div>
          <div className="options-actions">
            <Button type="primary" size="large" onClick={() => loadContract("abi")} loading={isLoadingContract} block>
              Load Contract
            </Button>
          </div>
        </Panel>
      </Collapse>
      {selectedNetwork.chainId === 2000 && (
        <div className="quick-access">
          <h3>Quick Access</h3>
          <ul>
            {quickAccessContracts.map(item => {
              return <li onClick={() => loadContract("verified", item.address)}>{item.name}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Homepage;
