import React from "react";
import { Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

const Manage = () => {
  return (
    <Flex flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
    </Flex>
  );
};

export default Manage;
