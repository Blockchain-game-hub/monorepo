import React, { useContext, useReducer, useEffect, useCallback, useState } from "react";
import WalletLink from "walletlink";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { authRequest } from "../utils/apiRequests";

const LS_KEY = 'portals:auth';

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
  auth: {}
};

const WalletContext = React.createContext({
  ...initialState,
  connect: () => {},
  disconnect: () => {},
});

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("WalletContext does not exist");
  }
  return context;
};

const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_ID,
    },
    display: {
      description: "Use Rainbow & other popular wallets",
    },
  },
  "custom-walletlink": {
    display: {
      logo: "/images/coinbase.svg",
      name: "Coinbase Wallet",
      description: "Connect to Coinbase Wallet mobile app",
    },
    options: {
      appName: "Coinbase", // App name on Infura
      networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      chainId: 1,
    },
    package: WalletLink,
    connector: async (_, options) => {
      const { appName, networkUrl, chainId } = options;
      const walletLink = new WalletLink({
        appName,
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      await provider.enable();
      return provider;
    },
  },
};

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions, // required
  });
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      };
    case "SET_ADDRESS":
      return {
        ...state,
        address: action.address,
      };
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "SET_AUTH":
      return {
        ...state,
        auth: action.auth,
      };
    case "RESET_WEB3_PROVIDER":
      return initialState;
    default:
      throw new Error();
  }
}

const WalletProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider } = state;

  const connect = useCallback(async () => {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal.connect();

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    const network = await web3Provider.getNetwork();
    // Generate a nonce and sign a transaction to verify the user
    try {
      const setAuth = (auth) => {
        dispatch({
          type: "SET_AUTH",
          auth: auth,
        });
      };
      await authRequest(address, signer, setAuth);
      localStorage.setItem(LS_KEY, JSON.stringify(state.auth));
    } catch (error) {
      console.log(error);
      disconnect();
      return;
    }

    dispatch({
      type: "SET_WEB3_PROVIDER",
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
      localStorage.removeItem(LS_KEY);
    },
    [provider]
  );

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        });
      };

      const handleChainChanged = (accounts: string[]) => {
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        });
      };

      const handleDisconnect = (error: { code: number; message: string }) => {
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  const actions = {
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={{ ...state, ...actions }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
