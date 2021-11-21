import React, { useEffect, useRef, useState } from "react";
import { Flex, Icon } from "@chakra-ui/react";
import PortalText, { textConfig } from "./PortalText";
import moment from "moment";
import Link from "next/link";
import { RiLock2Line } from "react-icons/ri";
import Spinner from "../components/Spinner";
import Image from "next/image";

const MediaPost = ({ content, setHideVideo }) => {
  const isWindowDefined = typeof window !== undefined;
  const [durationSeconds, setDurationSeconds] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  const vidRef = useRef();

  // Lock content after preview duration is over
  useEffect(() => {
    if (!durationSeconds) {
      return;
    }
    const currentTime = vidRef?.current?.currentTime;
    if (currentTime > durationSeconds) {
      console.log("hi");
      setHideVideo(true);
    }
  }, [durationSeconds, timestamp]);

  useEffect(() => {
    if (!content) {
      return;
    }
    if (content.type === "VIDEO") {
      const time = content.duration.split(":");
      let seconds =
        parseInt(time[0]) * 60 * 60 +
        parseInt(time[1]) * 60 +
        parseInt(time[2]);
      setDurationSeconds(seconds);
    }
  }, [content]);

  if (!isWindowDefined || !content.user) {
    console.log("hello");
    return <Spinner title="Loading" />;
  } else {
    return (
      <Flex flexDirection="column" mt="1em" mb="2em">
        <Flex>
          {
            // only showing image or video
            content.type === "VIDEO" ? (
              <video
                ref={vidRef}
                onTimeUpdate={(e) => setTimestamp(e.timeStamp)}
                src={content.ipfsURL}
                controls
                width="100%"
                height="auto"
              />
            ) : (
              <Image
                style={{
                  borderRadius: "4px",
                  width: "975px",
                }}
                src={content?.ipfsURL}
                alt={content?.title}
              />
            )
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
            <Flex
              mb="5"
              cursor="pointer"
              alignItems="center"
              justifyContent="center"
            >
              <img
                style={{
                  borderRadius: "50%",
                  width: "3em",
                  marginRight: "0.5em",
                }}
                src={content?.avatarURL || "/images/avatarPlaceholder.png"}
              />
              {content.user?.name ? (
                <PortalText config={textConfig.h3}>
                  {content.user.name}
                </PortalText>
              ) : (
                <>
                  <PortalText config={textConfig.h3}>
                    {content.user?.address}
                  </PortalText>
                </>
              )}
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
