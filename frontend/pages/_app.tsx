import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import WalletProvider from "../context/wallet";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const link = createHttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock-rinkeby",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <WalletProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </WalletProvider>
    </ApolloProvider>
  );
}

export default MyApp;
