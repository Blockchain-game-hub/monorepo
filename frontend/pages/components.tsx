import React from "react";
import { Flex, Button, useDisclosure } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
const Components = () => {
  return (
    <Flex bg="black" flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
    </Flex>
  );
};

export default Components;
