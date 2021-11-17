import React from "react";
import { Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { textConfig } from "../components/PortalText";
import PortalText from "../components/PortalText";
import ContentCard from "../components/ContentCard";

import { contentCards } from "../utils/mockData";

const Components = () => {
  return (
    <Flex flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <PortalText config={textConfig.h2}>Components</PortalText>

      <Flex p="10" flex="1" flexDirection="row">
        <ContentCard content={contentCards[0]} />
        <ContentCard content={contentCards[1]} />
      </Flex>
    </Flex>
  );
};

export default Components;
