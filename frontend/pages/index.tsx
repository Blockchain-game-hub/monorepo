import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Heading, Button, Flex, Grid, Container } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import ContentCard from "../components/ContentCard";
import PortalText, { textConfig } from "../components/PortalText";
import { useWalletContext } from "../context/wallet";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const walletContext = useWalletContext();
  const { auth, address, connect, disconnect } = walletContext;
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!address) {
      return;
    }
    async function fetchPostData() {
      try {
        const response = await fetch('/api/post', {
          method: "GET",
          headers: {
              "Authorization": `${auth?.token}`,
              "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setPosts(result);
        console.log(posts)
      } catch (err) {
        console.log("err", err);
      }
    }

    fetchPostData();
  }, [address]);

  return (
    <div style={{ background: "black" }}>
      <Navbar />
      <div className={styles.container}>
        <Head>
          <title>Portals - Create a portal into your world</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <Flex
            width="100%"
            backgroundImage="/images/ASU.gif"
            flexDirection="column"
            backgroundPosition="bottom"
            pb="10"
          >
            <PortalText
              config={textConfig.h2}
              style={{ textAlign: "center", lineHeight: "1.2" }}
            >
              Create a portal into your world
            </PortalText>
            <Container maxW="container.md" paddingTop="20px" centerContent>
              <PortalText
                config={textConfig.p2}
                style={{ textAlign: "center" }}
              >
                We are building a network where creators can tap into their
                community to create resilient collectives aligned by social or
                economic incentives.
              </PortalText>
              <Button
                onClick={address ? () => router.push("/manage") : connect}
                color="black"
                bg="white"
                borderRadius="5"
                marginTop="26px"
              >
                Create a Portal
              </Button>
            </Container>
          </Flex>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
            ]}
            gap={5}
            paddingTop="60px"
          >
            {posts.map((post) => {
              return <ContentCard key={post.id} content={post} showDate={true} />;
            })}
          </Grid>
        </main>
      </div>
    </div>
  );
};

export default Home;
