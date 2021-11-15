import React from "react";
import { Flex, Text, Button, Box } from "@chakra-ui/react";
import { useWalletContext } from "../context/wallet";
import Link from "next/link";

const Navbar = () => {
  const walletContext = useWalletContext();
  const { address, connect, disconnect } = walletContext;
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
      <Box>
        {address ? (
          <Button color="white" bg="red.400" onClick={disconnect}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={connect}>Connect Wallet</Button>
        )}
      </Box>
    </Flex>
  );
};

export default Navbar;
