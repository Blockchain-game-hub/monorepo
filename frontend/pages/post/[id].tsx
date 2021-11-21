import React, { useState, useEffect } from "react";
import {
  Container,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  useToast,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import MediaPost from "../../components/MediaPost";
import { useWalletContext } from "../../context/wallet";
import { useRouter } from "next/router";
import { ethers } from "ethers";

import { WalletService, Web3Service } from "@unlock-protocol/unlock-js";
import { useQuery } from "@apollo/client";
import {
  GET_OWNER_KEYS_FOR_LOCKS,
  GET_LOCKS_QUERY,
} from "../../graphql/unlock";
import Spinner from "../../components/Spinner";
import PortalText, { textConfig } from "../../components/PortalText";
import { renderTierName, renderBackgroundForTier } from "../portal/[address]";

const Post = () => {
  const walletContext = useWalletContext();
  const [walletService, setWalletService] = useState(null);
  const [web3Service, setWeb3Service] = useState(null);
  const [hideVideo, setHideVideo] = useState(false);
  const [selectedLock, setSelectedLock] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [locks, setLocks] = useState(null);
  const { auth, address: loggedInAddress } = walletContext;
  const [post, setPost] = useState([]);
  const router = useRouter();
  const { id } = router.query;

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
      const signer = web3Provider.getSigner();

      const unlockConfig = {
        4: {
          unlockAddress: "0xD8C88BE5e8EB88E38E6ff5cE186d764676012B0b",
          provider: web3Provider,
        },
      };

      const walletServiceInstance = new WalletService(unlockConfig);
      const web3ServiceInstance = new Web3Service(unlockConfig);

      await walletServiceInstance.connect(web3Provider);

      setWalletService(walletServiceInstance);
      setWeb3Service(web3ServiceInstance);
    }

    setupUnlock();
  }, [walletContext]);

  const { loading, data, error } = useQuery(GET_OWNER_KEYS_FOR_LOCKS, {
    variables: {
      lockAddresses: locks?.map((lock) => lock?.id),
      keyHolderAddress:
        (loggedInAddress && loggedInAddress.toLowerCase()) || "",
    },
    skip: !locks,
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    async function fetchPostData() {
      try {
        const response = await fetch(`/api/post/${id}`, {
          method: "GET",
          headers: {
            Authorization: `${auth?.token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setPost(result);
        console.log(post);
      } catch (err) {
        console.log("err", err);
      }
    }

    fetchPostData();
  }, [id]);

  const { loading: loadingLocks, data: lockData } = useQuery(GET_LOCKS_QUERY, {
    variables: {
      address: post?.user?.address,
    },
    skip: !post?.user?.address,
    onCompleted: (res) => setLocks(res?.locks),
  });

  if (!walletService || !web3Service || loading || !data) {
    console.log(web3Service);
    return <Spinner />;
  }

  const isContentUnlocked = (locks) => {
    if (!post?.isPrivate) {
      return true;
    }

    if (loggedInAddress === post?.user?.address) {
      return true;
    }

    if (!locks) {
      return false;
    }

    const PAD_TIMESTAMP_FACTOR = 1000;
    let result = false;

    locks.forEach((lock) => {
      if (lock.keys.length == 0) {
        return;
      }

      lock.keys.forEach((key) => {
        const expirationDate = parseInt(key.expiration) * PAD_TIMESTAMP_FACTOR;
        const now = new Date().getTime();

        if (expirationDate > now) {
          result = true;
        }
      });
    });

    if (!hideVideo && !result && post?.type === "VIDEO") {
      return true;
    }

    return result;
  };

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
          onClose();
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

  return (
    <Flex bg="black" flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Container maxW="975px" centerContent>
        <Flex mt="10" flexDirection="column" alignItems="center">
          {isContentUnlocked(data.locks) ? (
            <div />
          ) : (
            <>
              <PortalText config={textConfig.h2}>Content Locked</PortalText>
              <PortalText size="xl">Please purchase a membership</PortalText>
              <Flex
                mt="10"
                alignItems="center"
                justifyContent="center"
                width="100%"
              >
                {lockData.locks.map((lock: any) => (
                  <Flex
                    key={lock.address}
                    cursor="pointer"
                    onClick={() => {
                      setSelectedLock(lock);

                      onOpen();
                    }}
                    m="5"
                    height="15em"
                    width="15em"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="50%"
                    background={renderBackgroundForTier(
                      lock.expirationDuration
                    )}
                  >
                    <PortalText weight="500" size="3xl">
                      {lock.price / 10 ** 18} DAI
                    </PortalText>
                    <PortalText weight="400" size="xl">
                      {renderTierName(lock.expirationDuration)}
                    </PortalText>
                  </Flex>
                ))}
              </Flex>
            </>
          )}
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

        {isContentUnlocked(data.locks) && (
          <MediaPost setHideVideo={setHideVideo} content={post} />
        )}
      </Container>
    </Flex>
  );
};

export default Post;
