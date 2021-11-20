import React, { useState, useEffect } from "react";
import { Flex, Heading, useToast } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

import { ethers } from "ethers";
import { WalletService, Web3Service } from "@unlock-protocol/unlock-js";
import { useWalletContext } from "../context/wallet";
import { useQuery } from "@apollo/client";
import { GET_OWNER_KEYS_FOR_LOCKS } from "../graphql/unlock";

const Components = () => {
  const walletContext = useWalletContext();
  const [walletService, setWalletService] = useState(null);
  const [web3Service, setWeb3Service] = useState(null);

  const { address: loggedInAddress } = walletContext;
  useEffect(() => {
    if (
      !walletContext ||
      !walletContext.web3Provider ||
      !walletContext.provider
    ) {
      return;
    }

    async function setupUnlock() {
      const provider = await walletContext.provider;
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();

      console.log("signer", signer);
      const unlockConfig = {
        4: {
          unlockAddress: "0xD8C88BE5e8EB88E38E6ff5cE186d764676012B0b",
          provider: web3Provider,
        },
      };

      const walletServiceInstance = new WalletService(unlockConfig);
      const web3ServiceInstance = new Web3Service(unlockConfig);

      await walletServiceInstance.connect(web3Provider);

      setWalletService(walletServiceInstance);
      setWeb3Service(web3ServiceInstance);
    }

    setupUnlock();
  }, [walletContext]);

  const { loading, data, error } = useQuery(GET_OWNER_KEYS_FOR_LOCKS, {
    variables: {
      lockAddresses: [
        "0x7b8019AE3abaB923e84adfEe8e3859275b8E09c2",
        "0x1469c6Ac177482439830AFeb6E5d6CBA2900aAfD",
      ],
      keyHolderAddress: loggedInAddress.toLowerCase(),
    },
    onCompleted: (data) => console.log("rrr", data),
    onError: (err) => console.log(err),
  });

  if (!walletService || !web3Service || loading) {
    return <div />;
  }

  // TODO: Move this to backend
  const anyActiveKeys = (locks) => {
    if (!locks) {
      return false;
    }

    const PAD_TIMESTAMP_FACTOR = 1000;
    let result = false;

    locks.forEach((lock) => {
      if (lock.keys.length == 0) {
        return;
      }

      lock.keys.forEach((key) => {
        const expirationDate = parseInt(key.expiration) * PAD_TIMESTAMP_FACTOR;
        const now = new Date().getTime();

        if (expirationDate > now) {
          result = true;
        }
      });
    });

    return result;
  };

  return (
    <Flex bg="black" flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Flex
        bg="black"
        flex="1"
        minHeight="100vh"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading> {anyActiveKeys(data.locks) ? "Unlocked" : "Locked"}</Heading>
      </Flex>
    </Flex>
  );
};

export default Components;
