import React from "react";
import { Spinner as ChakraSpinner, Flex } from "@chakra-ui/react";
import PortalText from "./PortalText";

export default function Spinner({ title }) {
  return (
    <Flex
      bg="black"
      flex="1"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <ChakraSpinner mb="10" size="xl" alignSelf="center" />
      <PortalText size="xl" weight="600">
        {title}
      </PortalText>
    </Flex>
  );
}
