import React, { useEffect, useState } from "react";
import { Flex, Button, useDisclosure } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

import CreateMembershipModal from "../components/CreateMembershipModal";

const Components = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex bg="black" flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Button color="black" bg="white" width="10em" onClick={onOpen}>
        Mint Lock
      </Button>
      <CreateMembershipModal onClose={onClose} isOpen={isOpen} />
    </Flex>
  );
};

export default Components;
