import React from "react";
import { Text } from "@chakra-ui/react";

export const textConfig = {
  h1: {
    fontFamily: "Montago",
    fontSize: "80px",
  },
  h2: { fontFamily: "Montago", fontSize: "70px" },
  h3: { fontFamily: "Montago", fontSize: "42px" },
  p: { fontFamily: "Inter" },
};

const PortalText = ({ config = textConfig.p, children, size, weight }) => {
  return (
    <Text fontSize={size} fontWeight={weight} style={{ ...config }}>
      {children}
    </Text>
  );
};

export default PortalText;
