import React, { useState } from "react";
import { Flex, Box, Button, Grid } from "@chakra-ui/react";
import moment from "moment";
import ContentCard from "../../components/ContentCard";
import Navbar from "../../components/Navbar";
import { creator, contentCards } from "../../utils/mockData";
import PortalText, { textConfig } from "../../components/PortalText";

const Portal = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");

  return (
    <Flex flex="1" minHeight="100vh" flexDir="column">
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
          <Button
            mr="10"
            color="white"
            bg="none"
            border="1px solid white"
            borderRadius="5"
          >
            Edit Profile
          </Button>
        </Flex>
      </Flex>
      <Flex
        flexDirection="row"
        width="100%"
        minHeight="20em"
        justifyContent="center"
      >
        {/* TODO: Add carousel showcasing content here */}
      </Flex>

      <Flex
        flexDirection="column"
        width="100%"
        minHeight="25em"
        bg="#333333"
        justifyContent="space-between"
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
            <Button
              mr="10"
              color="white"
              bg="none"
              border="1px solid white"
              borderRadius="5"
            >
              Manage Portal
            </Button>{" "}
          </Flex>
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
    </Flex>
  );
};

export default Portal;
