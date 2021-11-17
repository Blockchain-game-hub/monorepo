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

const PortalText = ({
  config = textConfig.p,
  children,
  size,
  weight,
  color,
  style,
}) => {
  return (
    <Text
      fontSize={size}
      color={color}
      fontWeight={weight}
      style={{ ...config, ...style }}
    >
      {children}
    </Text>
  );
};

export default PortalText;
