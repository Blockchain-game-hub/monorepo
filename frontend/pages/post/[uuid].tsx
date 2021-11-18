import React from "react";
import { 
  Container,
  Flex, 
} from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import MediaPost from "../../components/MediaPost";
import { contentCards } from "../../utils/mockData";


const Post = ({ content }) => {
  return (
    <Flex flex="1" minHeight="100vh" flexDir="column">
      <Navbar />
      <Container maxW="975px" centerContent>
        <MediaPost content={contentCards[3]} showDate={false} />
      </Container>
    </Flex>
  );
};

export default Post;
