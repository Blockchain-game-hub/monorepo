import React from "react";
import { Flex, Text, Heading, Button } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

const NFTPort = () => {
  return (
    <Flex flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Flex p="10" flex="1">
        <Heading>NFTPort Experiments</Heading>
      </Flex>
    </Flex>
  );
};

export default NFTPort;
