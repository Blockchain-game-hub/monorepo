import React, { useEffect } from "react";
import { Flex, Button, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Navbar from "../components/Navbar";

import CreateMembershipModal from "../components/CreateMembershipModal";
import PortalText, { textConfig } from "../components/PortalText";
import { useWalletContext } from "../context/wallet";
import { useRouter } from "next/router";
import Spinner from "../components/Spinner";

const Manage = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const walletContext = useWalletContext();

  const { address } = walletContext;

  const isWindowDefined = typeof window !== undefined;

  useEffect(() => {
    if (!isWindowDefined) {
      return <div />;
    }
    if (!address) {
      router.push("/");
    }
  }, [isWindowDefined]);

  if (!isWindowDefined || !address) {
    return <Spinner title="Loading" />;
  }

  return (
    <Flex bg="black" flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Flex p="10" flex="1" flexDirection="column">
        <PortalText config={textConfig.h2}>Membership Tiers</PortalText>
        <PortalText size="xl" weight="500" config={textConfig.p}>
          Create and manage up to three membership tiers: Monthly, Yearly, and
          Lifetime.
        </PortalText>

        <Button
          mt="5"
          color="white"
          bg="none"
          border="1px dotted white"
          width="10em"
          height="20em"
          onClick={onOpen}
        >
          <AddIcon w={5} h={5} mr="3" />
          Add Tier
        </Button>
        <CreateMembershipModal onClose={onClose} isOpen={isOpen} />
      </Flex>
    </Flex>
  );
};

export default Manage;
