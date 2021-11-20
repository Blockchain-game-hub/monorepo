import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import theme from "../styles/theme";
import Script from "next/script";
export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montaga&display=swap"
            rel="stylesheet"
          />

          <Script
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            (function (d, s) {
              var js = d.createElement(s),
                sc = d.getElementsByTagName(s)[0];
              js.src = "https://paywall.unlock-protocol.com/static/unlock.1.0.min.js";
              sc.parentNode.insertBefore(js, sc);
            }(document, "script"));
          `,
            }}
          />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
