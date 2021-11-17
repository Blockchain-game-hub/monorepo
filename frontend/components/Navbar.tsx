import React from "react";
import { Flex, Text, Button, Box, useDisclosure } from "@chakra-ui/react";
import { useWalletContext } from "../context/wallet";
import Link from "next/link";
import PostModal from "./PostModal";

const Navbar = () => {
  const walletContext = useWalletContext();
  const { address, connect, disconnect } = walletContext;
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      p="5"
      top="0"
      width="100%"
      height="5em"
    >
      <Box cursor="pointer">
        <Link href="/">
          <Text fontSize="2em" fontWeight="700">
            🔮 Portal
          </Text>
        </Link>
      </Box>
      <Flex
        alignItems="flex-end"
        justifyContent="space-between"
      >
      <Box>
        {address ? (
          <Button color="white" bg="red.400" onClick={disconnect}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={connect}>Connect Wallet</Button>
        )}
      </Box>
      <Box>
          <Button onClick={onOpen}>Create</Button>
      </Box>
      {PostModal(isOpen, onClose)}
      </Flex>
    </Flex>
  );
};

export default Navbar;
