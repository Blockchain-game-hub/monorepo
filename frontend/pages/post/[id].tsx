import React, { useState, useEffect } from "react";
import { Container, Flex } from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import MediaPost from "../../components/MediaPost";
import { useWalletContext } from "../../context/wallet";
import { useRouter } from "next/router";

const Post = () => {
  const walletContext = useWalletContext();
  const { auth } = walletContext;
  const [post, setPost] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    async function fetchPostData() {
      try {
        const response = await fetch(`/api/post/${id}`, {
          method: "GET",
          headers: {
              "Authorization": `${auth?.token}`,
              "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setPost(result);
        console.log(post)
      } catch (err) {
        console.log("err", err);
      }
    }
  
    fetchPostData();
  }, [id]);
  return (
    <Flex bg="black" flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Container maxW="975px" centerContent>
        <MediaPost content={post} />
      </Container>
    </Flex>
  );
};

export default Post;
