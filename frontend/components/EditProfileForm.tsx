import {
  Icon,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaPencilAlt } from "react-icons/fa";
import PortalText from "./PortalText";
import React, { useEffect } from "react";
import { useWalletContext } from "../context/wallet";

export default function EditProfileForm() {
  const toast = useToast();
  const walletContext = useWalletContext();
  const { auth } = walletContext;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialValues = {
    name: auth.name ? auth.name : "",
    username: auth.username ? auth.username : "",
    email: auth.email ? auth.email : "",
  };
  useEffect(() => {
    if (!auth) {
      return;
    }
    const initialValues = {
      name: auth.name ? auth.name : "",
      username: auth.username ? auth.username : "",
      email: auth.email ? auth.email : "",
    };
    setValues(initialValues);
  }, [auth]);
  const [values, setValues] = React.useState(initialValues);
  const handleChange = (event) =>
    setValues({ ...values, [event.target.name]: event.target.value });
  const [submitting, setSubmitting] = React.useState(false);

  // TODO: Show error message on input fields
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await fetch("/api/user", {
        method: "PUT",
        headers: {
          Authorization: `${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      toast({ title: "Profile Updated", status: "success" });
      onClose();
    } catch (err) {
      toast({ title: "An error occurred", status: "error" });
      // TODO: Show success or error
      setSubmitting(false);
    }
  };

  return (
    <>
      <MenuItem onClick={onOpen}>
        <Icon w={5} h={5} as={FaPencilAlt} style={{ marginRight: "1em" }} />
        <PortalText weight="500">Edit Profile</PortalText>
      </MenuItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#1F1F1F" color="#FFFFFF">
          <ModalCloseButton />

          <ModalHeader fontFamily="Montaga">Edit your profile</ModalHeader>
          <ModalBody>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="What is your name"
                mb="8px"
              />
            </FormControl>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={values.username}
                onChange={handleChange}
                placeholder="What should people call you?"
                mb="8px"
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="What should people call you?"
                type="email"
                mb="8px"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter color="#000">
            <Button
              bg="white"
              color="black"
              isLoading={submitting}
              loadingText="Saving"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
