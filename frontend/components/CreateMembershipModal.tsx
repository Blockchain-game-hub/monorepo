import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import PortalText, { textConfig } from "./PortalText";
import { membershipDurations } from "../utils/unlock";

import { ethers } from "ethers";
import { WalletService } from "@unlock-protocol/unlock-js";
import { useWalletContext } from "../context/wallet";

const CreateMembershipModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [priceDAI, setPriceDAI] = useState(null);
  const [numKeys, setNumKeys] = useState(null);
  const [tier, setTier] = useState(membershipDurations[0]);

  const walletContext = useWalletContext();
  const toast = useToast();
  const [walletService, setWalletService] = useState(null);

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

  if (!walletService) {
    return <div />;
  }

  // Rinkeby DAI
  const currencyContractAddress = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";

  async function createLock() {
    await walletService.createLock(
      {
        maxNumberOfKeys: numKeys,
        currencyContractAddress,
        keyPrice: priceDAI,
        name,
        expirationDuration: tier.expirationDuration,
      },
      (error, hash) => {
        if (error) {
          toast({ title: "Failed to create membership" });
        }
        // This is the hash of the transaction!
        console.log("txn hash", { hash });
        toast({ title: "Successfully created membership" });
      }
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent alignItems="flex-start">
        <ModalHeader>
          <PortalText config={textConfig.h4}>Add Membership Tier</PortalText>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody width="100%">
          <Box mb="5">
            <PortalText color="#BDBDBD" weight="600">
              Name of membership tier
            </PortalText>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              width="80%"
              mt="3"
            />
          </Box>
          <Box mb="5">
            <PortalText color="#BDBDBD" weight="600">
              Duration of access
            </PortalText>
            <Menu>
              <MenuButton mt="3" rightIcon={<ChevronDownIcon />} as={Button}>
                {tier.label}
              </MenuButton>
              <MenuList>
                {membershipDurations.map((duration, idx) => {
                  return (
                    <MenuItem onClick={() => setTier(membershipDurations[idx])}>
                      {duration.label}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          </Box>
          <Box mb="5">
            <PortalText color="#BDBDBD" weight="600">
              Cost
            </PortalText>
            <Flex alignItems="flex-end">
              <Input
                value={priceDAI}
                onChange={(e) => setPriceDAI(e.target.value)}
                width="30%"
                mt="3"
                mr="3"
              />
              <PortalText color="#BDBDBD" weight="600" size="xl">
                DAI
              </PortalText>
            </Flex>
          </Box>
          <Box mb="5">
            <PortalText color="#BDBDBD" weight="600">
              Total number available
            </PortalText>
            <Input
              value={numKeys}
              onChange={(e) => setNumKeys(e.target.value)}
              width="50%"
              mt="3"
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            color="black"
            bg="white"
            borderRadius="5"
            onClick={createLock}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateMembershipModal;
