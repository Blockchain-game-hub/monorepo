import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import moment from "moment";
import { RiLock2Line } from "react-icons/ri";
import Link from "next/link";

import PortalText from "./PortalText";

const ContentCard = ({ content, showDate = true }) => {
  return (
    <Link href={`/post/${content.id}`}>
      <Flex
        borderRadius="4"
        bg="white"
        height="25em"
        width="17em"
        flexDirection="column"
        cursor="pointer"
      >
        <Flex height="75%" position="relative" width="100%">
          <Flex
            borderTopRadius="4"
            width="100%"
            height="100%"
            backgroundImage={
              content?.previewImageURL || "/images/placeholder.png"
            }
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            position="absolute"
          />
          {content?.isPrivate && (
            <Flex
              zIndex="2"
              borderTopRadius="4"
              bg="rgba(0,0,0,0.75)"
              width="100%"
              alignItems="center"
              justifyContent="center"
              height="100%"
              flexDirection="column"
            >
              <Icon mb={2} as={RiLock2Line} w={10} h={10} color="white" />
              <PortalText weight="500" size="1.25em">
                Members-Only
              </PortalText>
            </Flex>
          )}
        </Flex>
        <Flex p="3" width="100%" flexDirection="column">
          {showDate && (
            <PortalText weight="500" size="xs" color="#52525B">
              {moment(content.publishedAt).format("MMMM Do YYYY")}
            </PortalText>
          )}
          <PortalText
            style={{ marginTop: "0.5em" }}
            color="black"
            size="xl"
            weight="500"
          >
            {content.title}
          </PortalText>
          <Flex mt="1em" alignItems="center">
            <img
              style={{
                borderRadius: "50%",
                width: "1.5em",
                marginRight: "0.5em",
              }}
              src={content?.avatarURL || "/images/avatarPlaceholder.png"}
            />
            <PortalText weight="500" size="sm" color="#52525B">
              {content.author}
            </PortalText>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default ContentCard;
