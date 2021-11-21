import React, { useState, useEffect } from "react";
import { Container, Flex, Heading } from "@chakra-ui/react";
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

const Post = () => {
  const walletContext = useWalletContext();
  const [walletService, setWalletService] = useState(null);
  const [web3Service, setWeb3Service] = useState(null);
  const [hideVideo, setHideVideo] = useState(false);

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

  useQuery(GET_LOCKS_QUERY, {
    variables: {
      address: post?.user?.address,
    },
    skip: !post?.user?.address,
    onCompleted: (res) => setLocks(res?.locks),
  });

  if (!walletService || !web3Service || loading || !data) {
    console.log("hello", loading, data);

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

  return (
    <Flex bg="black" flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Container maxW="975px" centerContent>
        <Heading>
          {isContentUnlocked(data.locks)
            ? ""
            : "Content Locked -  Please purchase a membership"}
        </Heading>

        {isContentUnlocked(data.locks) && (
          <MediaPost setHideVideo={setHideVideo} content={post} />
        )}
      </Container>
    </Flex>
  );
};

export default Post;
