import React, { useEffect } from "react";
import { Flex, Icon } from "@chakra-ui/react";
import PortalText, { textConfig } from "./PortalText";
import moment from "moment";
import Link from "next/link";
import { RiLock2Line } from "react-icons/ri";
import Spinner from "../components/Spinner";

const MediaPost = ({ content }) => {
  
  const isWindowDefined = typeof window !== undefined;
  if (!isWindowDefined || !content.user) {
    return <Spinner title="Loading" />;
  } else {
    return (
      <Flex flexDirection="column" mt="1em" mb="2em">
        <Flex>
          {
            // only showing image or video
            content.type === "VIDEO" ?
            <video
              src={content.ipfsURL}
              controls
              width="100%"
              height="auto"
            /> :
            <img
              style={{
                borderRadius: "4px",
                width: "975px",
              }}
              src={content?.ipfsURL}
            />
          }
        </Flex>
  
        <Flex mt="2em" mb="3em" alignItems="center" justifyContent="center">
          <PortalText
            config={textConfig.bigField}
            style={{ textTransform: "uppercase", color: "#ccc" }}
          >
            {moment(content.publishedAt).format("MMMM Do YYYY")}
          </PortalText>
        </Flex>
  
        <PortalText config={textConfig.h2} style={{ textAlign: "center" }}>
          {content.title}
        </PortalText>
  
        <PortalText config={textConfig.p2}>{content.description}</PortalText>
  
        <Flex
          mt="4em"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <PortalText
            config={textConfig.bigField}
            style={{ textTransform: "uppercase", color: "#ccc" }}
          >
            Created By
          </PortalText>
          <Link href={`/portal/${content.user?.address}`}>
            <Flex cursor="pointer" alignItems="center" justifyContent="center">
              <img
                style={{
                  borderRadius: "50%",
                  width: "3em",
                  marginRight: "0.5em",
                }}
                src={content?.avatarURL}
              />
              {content.user?.name || content.user?.username ? 
                <>
                  <PortalText config={textConfig.h3}>{content.user.username}</PortalText>
                  <PortalText config={textConfig.h3}>{content.user.name}</PortalText>
                </>
                :
                <>
                  <PortalText config={textConfig.h3}>{content.user?.address}</PortalText>
                </>
              }
            </Flex>
          </Link>
        </Flex>
  
        {content?.isPrivate && (
          <Flex
            mt="0.5em"
            width="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection="row"
          >
            <Icon mr={2} mb={1} as={RiLock2Line} w={6} h={6} color="c4c4c4" />
            <PortalText weight="500" color="#c4c4c4">
              For members-only
            </PortalText>
          </Flex>
        )}
      </Flex>
    );
  }
};

export default MediaPost;
