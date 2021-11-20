import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Button,
  Grid,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import ContentCard from "../../components/ContentCard";
import Navbar from "../../components/Navbar";
import { creator, contentCards } from "../../utils/mockData";
import PortalText, { textConfig } from "../../components/PortalText";
import { capitalizeFirstChar } from "../../utils/strings";
import { useQuery } from "@apollo/client";
import { ethers } from "ethers";
import { WalletService, Web3Service } from "@unlock-protocol/unlock-js";
import { useWalletContext } from "../../context/wallet";
import { GET_LOCKS_QUERY } from "../../graphql/unlock";
import { useRouter } from "next/router";

const Portal = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [selectedLock, setSelectedLock] = useState(null);
  const walletContext = useWalletContext();
  const [walletService, setWalletService] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const { username } = router.query;
  const { auth } = walletContext;
  const myUsername = auth?.username;

  const isCreator = username === myUsername;

  useEffect(() => {
    if (
      !walletContext ||
      !walletContext.web3Provider ||
      !walletContext.provider
    ) {
      return;
    }

    async function setupUnlock() {
      const provider = await walletContext.provider;
      const web3Provider = new ethers.providers.Web3Provider(provider);

      const unlockConfig = {
        4: {
          unlockAddress: "0xD8C88BE5e8EB88E38E6ff5cE186d764676012B0b",
          provider: web3Provider,
        },
      };

      const instance = new WalletService(unlockConfig);
      await instance.connect(web3Provider);

      setWalletService(instance);
    }

    setupUnlock();
  }, [walletContext]);

  const renderBackgroundForTier = (tier) => {
    const normalizedTier = tier.toLowerCase();
    if (normalizedTier.includes("month")) {
      return "radial-gradient(50% 50% at 50% 50%, #BD975D 0%, rgba(38, 37, 37, 0.65) 100%)";
    } else if (
      normalizedTier.includes("year") ||
      normalizedTier.includes("annual")
    ) {
      return "radial-gradient(50% 50% at 50% 50%, #C0BFBF 0%, rgba(38, 37, 37, 0.65) 100%)";
    } else {
      return "radial-gradient(50% 50% at 50% 50%, #B4A737 0%, rgba(38, 37, 37, 0.65) 100%)";
    }
  };

  // TODO: Replace this with addr fetched from backend
  const creatorAddress = "0x9c16ACA0987EDC05c5b4C4CA01e44a5D80F28457";

  const {
    loading,
    data: lockData,
    error,
  } = useQuery(GET_LOCKS_QUERY, {
    variables: {
      address: creatorAddress,
    },
  });

  async function purchaseKey(lockAddress) {
    try {
      await walletService.purchaseKey(
        {
          lockAddress,
        },
        (error, hash) => {
          // This is the hash of the transaction!
          console.log({ hash });
          toast({
            title: "Successfully Purchased Membership",
            status: "success",
          });
        }
      );
    } catch (err) {
      let title = err.message;
      if (err.message.includes("insufficient funds")) {
        title = "Insufficient Funds";
      }
      toast({ title, status: "error" });
    }
  }

  if (!walletService || loading) {
    return (
      <Flex
        bg="black"
        flex="1"
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
      >
        <Spinner mb="10" size="xl" alignSelf="center" />
        <PortalText size="xl" weight="600">
          Loading Portal
        </PortalText>
      </Flex>
    );
  }

  return (
    <Flex bg="black" flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Flex
        justifyContent="center"
        width="100%"
        height="35vh"
        position="relative"
      >
        <Flex
          width="100%"
          height="85%"
          backgroundImage={creator.coverPhotoURL}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          position="absolute"
        />
        <Flex
          zIndex="2"
          height="12em"
          width="12em"
          alignSelf="flex-end"
          backgroundImage={creator.avatarURL}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          borderRadius="50%"
          border="1em solid black"
        />
      </Flex>

      <Flex
        flexDirection="row"
        width="100%"
        minHeight="10em"
        pb="10"
        justifyContent="center"
      >
        <Flex width="10%" />
        <Flex width="80%" flexDirection="column" alignItems="center">
          <PortalText style={{ textAlign: "center" }} config={textConfig.h2}>
            {creator.name}
          </PortalText>
          <PortalText
            size="lg"
            style={{ maxWidth: "25em", textAlign: "center" }}
            config={textConfig.p}
          >
            {creator.bio}
          </PortalText>
          <Flex mt="5" flexDirection="row">
            <Box>
              <PortalText>{creator.location}</PortalText>
            </Box>
            <Box ml="10" mr="10">
              <PortalText>
                Joined {moment(creator.joinedAt).format("MMMM YYYY")}
              </PortalText>
            </Box>
            <Box>
              <PortalText>{creator.website}</PortalText>
            </Box>
          </Flex>
        </Flex>

        <Flex width="10%" justifyContent="flex-end">
          {isCreator ? (
            <Button
              mr="10"
              color="white"
              bg="none"
              border="1px solid white"
              borderRadius="5"
            >
              Edit Profile
            </Button>
          ) : null}
        </Flex>
      </Flex>
      {false && (
        <Flex
          flexDirection="row"
          width="100%"
          minHeight="20em"
          justifyContent="center"
        >
          {/* TODO: Add carousel showcasing content here */}
        </Flex>
      )}

      <Flex
        pb="10"
        flexDirection="column"
        width="100%"
        minHeight="25em"
        bg="#333333"
        justifyContent="flex-start"
      >
        <Flex
          flexDirection="row"
          width="100%"
          pt="10"
          justifyContent="space-between"
        >
          <Flex width="10%" />
          <Flex width="80%" flexDirection="column" alignItems="center">
            <PortalText config={textConfig.h3}>
              Join {creator.name}'s Portal{" "}
            </PortalText>
            <PortalText config={textConfig.p}>
              Unlock the forum, tasks, and members-only media
            </PortalText>
          </Flex>

          <Flex width="10%" justifyContent="flex-end">
            {isCreator ? (
              <Link href="/manage">
                <Button
                  mr="10"
                  color="white"
                  bg="none"
                  border="1px solid white"
                  borderRadius="5"
                >
                  Manage Portal
                </Button>
              </Link>
            ) : null}
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="center" width="100%">
          {lockData.locks.map((lock) => (
            <Flex
              cursor="pointer"
              onClick={() => {
                setSelectedLock(lock);

                onOpen();
              }}
              bg="red"
              m="5"
              height="15em"
              width="15em"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRadius="50%"
              background={renderBackgroundForTier(lock.name)}
            >
              <PortalText weight="500" size="3xl">
                {lock.price / 10 ** 18} DAI
              </PortalText>
              <PortalText weight="400" size="xl">
                {capitalizeFirstChar(lock.name)}
              </PortalText>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex
        flexDirection="column"
        width="100%"
        minHeight="20em"
        alignItems="center"
        paddingBottom="20"
      >
        <Flex pt="5" pl="10" width="100%" alignItems="flex-start">
          <Box onClick={() => setSelectedTab("ALL")}>
            <PortalText
              style={{
                ...(selectedTab === "ALL"
                  ? { textDecoration: "underline" }
                  : {}),
                marginRight: "1em",
              }}
              weight="600"
              size="xl"
            >
              All
            </PortalText>
          </Box>
          <Box onClick={() => setSelectedTab("PUBLIC")}>
            <PortalText
              style={{
                ...(selectedTab === "PUBLIC"
                  ? { textDecoration: "underline" }
                  : {}),
                marginRight: "1em",
              }}
              weight="600"
              size="xl"
            >
              Public
            </PortalText>
          </Box>
          <Box onClick={() => setSelectedTab("MEMBERS")}>
            <PortalText
              style={{
                ...(selectedTab === "MEMBERS"
                  ? { textDecoration: "underline" }
                  : {}),
              }}
              weight="600"
              size="xl"
            >
              Members-Only
            </PortalText>
          </Box>
        </Flex>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(1, 1fr)",
            "repeat(4, 1fr)",
          ]}
          gap={10}
          paddingTop="30px"
        >
          {/* TODO: Add tab bar to select All | Public | Members Only */}
          <ContentCard content={contentCards[0]} showDate={false} />
          <ContentCard content={contentCards[1]} showDate={false} />
          <ContentCard content={contentCards[2]} showDate={false} />
          <ContentCard content={contentCards[3]} showDate={false} />
        </Grid>
      </Flex>
      {selectedLock && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg="#1F1F1F">
            <ModalHeader>Confirm Purchase</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <PortalText weight="500">
                You are purchasing the {selectedLock.name} membership for{" "}
                {selectedLock.price / 10 ** 18} DAI
              </PortalText>
            </ModalBody>

            <ModalFooter>
              <Button
                color="black"
                bg="white"
                onClick={() => purchaseKey(selectedLock.id)}
              >
                Purchase
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};

export default Portal;