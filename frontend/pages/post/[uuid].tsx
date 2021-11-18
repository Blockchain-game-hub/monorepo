import React from "react";
import { Flex } from "@chakra-ui/react";
import Navbar from "../../components/Navbar";

const Post = () => {
  return (
    <Flex flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
    </Flex>
  );
};

export default Post;
