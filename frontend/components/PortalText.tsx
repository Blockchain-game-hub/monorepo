import React from "react";
import { Text } from "@chakra-ui/react";

export const textConfig = {
  h1: {
    fontFamily: "Montaga",
    fontSize: "80px",
  },
  h2: { fontFamily: "Montaga", fontSize: "70px" },
  h3: { fontFamily: "Montaga", fontSize: "42px" },
  p: { fontFamily: "Inter" },
  p2: { fontFamily: "Inter", fontSize: "18px" },
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
