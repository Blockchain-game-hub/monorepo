import React, { useState, useEffect } from "react";
import { Flex, Button, useToast } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

import { ethers } from "ethers";
import { WalletService, Web3Service } from "@unlock-protocol/unlock-js";
import { useWalletContext } from "../context/wallet";
import { useLazyQuery } from "@apollo/client";
import { GET_LOCKS_QUERY } from "../graphql/unlock";

const Components = () => {
  const walletContext = useWalletContext();
  const [walletService, setWalletService] = useState(null);
  const toast = useToast();
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

      const unlockConfig = {
        4: {
          unlockAddress: "0xD8C88BE5e8EB88E38E6ff5cE186d764676012B0b",
          provider: web3Provider,
        },
      };

      const instance = new WalletService(unlockConfig);
      await instance.connect(web3Provider);

      setWalletService(instance);
    }

    setupUnlock();
  }, [walletContext]);

  const [query, { loading, data, error }] = useLazyQuery(GET_LOCKS_QUERY, {
    onCompleted: (data) => console.log(data),
    onError: (err) => console.log(err),
  });

  if (!walletService) {
    return <div />;
  }

  console.log(loading, data);

  const lockAddress = "0x7b8019AE3abaB923e84adfEe8e3859275b8E09c2";

  async function purchaseKey() {
    await walletService.purchaseKey(
      {
        lockAddress,
      },
      (error, hash) => {
        // This is the hash of the transaction!
        console.log({ hash });
        toast({
          title: "Successfully Purchased Membership",
          status: "success",
        });
      }
    );
  }
  return (
    <Flex bg="black" flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Button onClick={purchaseKey}>Purchase Key</Button>
    </Flex>
  );
};

export default Components;
