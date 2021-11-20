import React from "react";  
import {
  Flex,
  Icon,
  Button,
  Box,
  Menu,
  Text,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import PortalText from "./PortalText";
import Gravatar from "react-gravatar";
import { useWalletContext } from "../context/wallet";
import Link from "next/link";
import { IoGridOutline } from "react-icons/io5";
import { FiLogOut, FiHelpCircle } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { truncateAddress } from "../utils/address";
import PostModal from "./PostModal";
import EditProfileForm from "./EditProfileForm";

const Navbar = () => {
  const walletContext = useWalletContext();
  const { address, connect, disconnect } = walletContext;

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      p="5"
      top="0"
      width="100%"
      height="5em"
    >
      <Box cursor="pointer">
        <Link href="/">
          <Box width="10em">
            <img src="/images/logo.svg" />
          </Box>
        </Link>
      </Box>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Box>
          {address ? (
            <Flex>
              <Menu>
                <MenuButton color="black" bg="white" mr="5" as={Button}>
                  <Flex alignItems="center">
                    <Gravatar
                      size={30}
                      style={{ borderRadius: "999px" }}
                      email={address}
                    />
                    <Text ml="3">{truncateAddress(address)}</Text>
                  </Flex>
                </MenuButton>
                <MenuList color="black" bg="white">

                  <Link href="/portal/anita">
                    <MenuItem>
                      <Icon
                        w={5}
                        h={5}
                        as={FaRegUserCircle}
                        style={{ marginRight: "1em" }}
                      />
                      <PortalText weight="500">View Portal</PortalText>
                    </MenuItem>
                  </Link>
                  <Link href="/manage">
                    <MenuItem>
                      <Icon
                        as={IoGridOutline}
                        w={5}
                        h={5}
                        style={{ marginRight: "1em" }}
                      />
                      <PortalText weight="500">Manage Portal</PortalText>
                    </MenuItem>
                  </Link>

                  <EditProfileForm />
                  <MenuItem>
                    <Icon
                      w={5}
                      h={5}
                      as={FaRegUserCircle}
                      style={{ marginRight: "1em" }}
                    />
                    <PortalText weight="500">View Portal</PortalText>
                  </MenuItem>
                  <MenuItem>
                    <Icon
                      as={IoGridOutline}
                      w={5}
                      h={5}
                      style={{ marginRight: "1em" }}
                    />
                    <PortalText weight="500">Manage Portal</PortalText>
                  </MenuItem>

                  <MenuItem>
                    <Icon
                      w={5}
                      h={5}
                      as={FiHelpCircle}
                      style={{ marginRight: "1em" }}
                    />
                    <PortalText weight="500">Help</PortalText>
                  </MenuItem>
                  <MenuItem onClick={disconnect}>
                    <Icon
                      w={5}
                      h={5}
                      as={FiLogOut}
                      style={{ marginRight: "1em" }}
                    />
                    <PortalText weight="500">Disconnect</PortalText>
                  </MenuItem>
                </MenuList>
              </Menu>
            <PostModal />
            </Flex>
          ) : (
            <Button color="black" bg="white" borderRadius="5" onClick={connect}>
              Connect Wallet
            </Button>
          )}
        </Box>

      </Flex>
    </Flex>
  );
};

export default Navbar;
