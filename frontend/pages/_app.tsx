import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import WalletProvider from "../context/wallet";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WalletProvider>
  );
}

export default MyApp;
