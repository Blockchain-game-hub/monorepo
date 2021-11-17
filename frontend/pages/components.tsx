import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { textConfig } from "../components/PortalText";
import PortalText from "../components/PortalText";

const Components = () => {
  return (
    <Flex flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Flex p="10" flex="1">
        <PortalText config={textConfig.h2}>Components</PortalText>
      </Flex>
    </Flex>
  );
};

export default Components;
