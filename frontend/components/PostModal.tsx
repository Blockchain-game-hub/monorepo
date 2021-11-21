import {
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Text,
  Textarea,
  Flex,
  Checkbox,
  FormControl,
  FormLabel,
  Image,
  Divider,
  VStack,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { IoDiamondOutline } from "react-icons/io5";
import React from "react";
import { useWalletContext } from "../context/wallet";

export default function PostModal() {
  const walletContext = useWalletContext();
  const { auth } = walletContext;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialValues = {
    title: "",
    description: "",
    type: null,
    file: null,
    isPrivate: false,
  };
  const toast = useToast();
  const [values, setValues] = React.useState(initialValues);
  const handleChange = (event) =>
    setValues({ ...values, [event.target.name]: event.target.value });
  const setFile = (event) =>
    setValues({ ...values, [event.target.name]: event.target.files[0] });
  const setIsPrivate = (event) =>
    setValues({ ...values, [event.target.name]: event.target.checked });

  // TODO: Add missing membership step
  const steps = ["create", "preview"];
  const [step, setStep] = React.useState(0);
  const [confirmSubmit, setConfirmSubmit] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // TODO: Show error message on input fields
  const handleSubmit = async () => {
    if (step < steps.length - 1) {
      if (values.title === "" || values.title === null) {
        alert("Please enter a title");
        return;
      }
      if (values.type === null) {
        alert("Please select a type");
        return;
      }
      if (values.file === null) {
        alert("Please select a file");
        return;
      }

      if (
        values.type === "VIDEO" &&
        values.isPrivate &&
        !values.duration.includes(":")
      ) {
        alert("Please enter a valid timestamp in the format hh:mm:ss");
        return;
      }
      setStep(step + 1);
    } else {
      if (confirmSubmit) {
        setSubmitting(true);
        const formData = new FormData();
        for (const name in values) {
          formData.append(name, values[name]);
        }
        formData.append("authorId", auth?.id);

        await fetch("/api/post", {
          method: "POST",
          headers: {
            Authorization: `${auth.token}`,
          },
          body: formData,
        }).then((res) => {
          if (res.status === 200) {
            toast({
              status: "success",
              title: "Successfully Uploaded Post to IPFS",
            });
            setValues(initialValues);
            setStep(0);
            onClose();
          } else {
            toast({
              status: "error",
              title: "Error Uploading Post to IPFS",
            });
          }
          setSubmitting(false);
          setStep(0);
          setValues(initialValues);

          onClose();
        });
      } else {
        alert("Please confirm that you want to publish");
      }
    }
  };

  // FIXME: This doesn't seem to work
  const styles = {
    inputStyle: {
      background: "#262626",
      border: "1px solid #404040",
      boxSizing: "border-box",
      borderRadius: "4px",
    },
    buttonStyle: {
      background: "transparent",
      border: "1px solid #9C9A9A",
      borderRadius: "4px",
    },
    labelStyle: {
      color: "#BDBDBD",
    },
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <ModalHeader fontFamily="Montaga">Create Media</ModalHeader>
            <ModalBody>
              <FormControl mb="3" id="title">
                <FormLabel
                  color="#BDBDBD"
                  fontWeight="700"
                  className={styles.labelStyle}
                >
                  Title
                </FormLabel>
                <Input
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  placeholder="What is the title"
                  size="sm"
                  mb="8px"
                  className={styles.inputStyle}
                />
              </FormControl>
              <FormControl mb="3" id="description">
                <FormLabel
                  color="#BDBDBD"
                  fontWeight="700"
                  className={styles.labelStyle}
                >
                  Description (optional)
                </FormLabel>
                <Textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  placeholder="What is this media about"
                  type="textarea"
                  mb="8px"
                  className={styles.inputStyle}
                />
              </FormControl>

              <FormControl mb="3" id="file">
                <FormLabel
                  color="#BDBDBD"
                  fontWeight="700"
                  className={styles.labelStyle}
                >
                  Upload Attachment (select one)
                </FormLabel>
                {values.type === null ? (
                  <Flex
                    alignItems="center"
                    flexDirection="row-reverse"
                    justifyContent="space-between"
                    p="5"
                    top="0"
                    width="100%"
                  >
                    <Button
                      name="type"
                      value="IMAGE"
                      color="white"
                      height="8em"
                      width="45%"
                      onClick={handleChange}
                      colorScheme={
                        values.type === "IMAGE" ? "blue" : "transparent"
                      }
                      borderRadius="4px"
                      border="1px solid"
                      borderColor={
                        values.type === "IMAGE" ? "transparent" : "#9C9A9A"
                      }
                    >
                      <Flex flexDirection="column">
                        <Text>Image</Text>
                        <Text fontWeight="300">.png .jpg .gif or .tiff</Text>
                      </Flex>
                    </Button>
                    {/* <Button
                      name="type"
                      value="TEXT"
                      color="white"
                      onClick={handleChange}
                      colorScheme={
                        values.type === "TEXT" ? "blue" : "transparent"
                      }
                      borderRadius="4px"
                      border="1px solid"
                      borderColor={
                        values.type === "TEXT" ? "transparent" : "#9C9A9A"
                      }
                    >
                      Text
                    </Button>
                    <Button
                      name="type"
                      value="AUDIO"
                      color="white"
                      onClick={handleChange}
                      colorScheme={
                        values.type === "AUDIO" ? "blue" : "transparent"
                      }
                      borderRadius="4px"
                      border="1px solid"
                      borderColor={
                        values.type === "AUDIO" ? "transparent" : "#9C9A9A"
                      }
                    >
                      Audio
                    </Button> */}
                    <Button
                      name="type"
                      value="VIDEO"
                      height="8em"
                      color="white"
                      width="45%"
                      onClick={handleChange}
                      colorScheme={
                        values.type === "VIDEO" ? "blue" : "transparent"
                      }
                      borderRadius="4px"
                      border="1px solid"
                      borderColor={
                        values.type === "VIDEO" ? "transparent" : "#9C9A9A"
                      }
                    >
                      <Flex flexDirection="column">
                        <Text>Video</Text>
                        <Text fontWeight="300">.mp4 or .mov</Text>
                      </Flex>
                    </Button>
                  </Flex>
                ) : (
                  // TODO: Style this better
                  <Input
                    mt="2"
                    mb="5"
                    alignItems="center"
                    name="file"
                    padding="5"
                    height="5em"
                    onChange={setFile}
                    type="file"
                    className={styles.inputStyle}
                  />
                )}
              </FormControl>
              {values.type === "VIDEO" && values.isPrivate ? (
                <FormControl mb="3" id="duration">
                  <FormLabel
                    color="#BDBDBD"
                    fontWeight="700"
                    className={styles.labelStyle}
                  >
                    Public Preview Duration
                  </FormLabel>
                  <Text
                    mb="2"
                    mt="1"
                    fontStyle="italic"
                    fontSize="sm"
                    color="#BDBDBD"
                  >
                    Enter the time marker in the format{" "}
                    <strong>hh:mm:ss</strong>, denoting when the content starts
                    becoming restricted to members-only. Leave blank for no
                    preview.
                  </Text>
                  <Input
                    name="duration"
                    value={values.duration}
                    onChange={handleChange}
                    placeholder="00:00:00"
                    type="textarea"
                    mb="8px"
                    className={styles.inputStyle}
                  />
                </FormControl>
              ) : null}
              <FormControl mb="3" id="restrict">
                <FormLabel
                  color="#BDBDBD"
                  fontWeight="700"
                  className={styles.labelStyle}
                >
                  Restrict Media to Members-Only
                </FormLabel>
                <Checkbox
                  name="isPrivate"
                  isChecked={values.isPrivate}
                  onChange={setIsPrivate}
                  className={styles.inputStyle}
                >
                  Enabled
                </Checkbox>
              </FormControl>
            </ModalBody>
          </>
        );
      case 1:
        return (
          <>
            <ModalHeader fontFamily="Montaga">Preview</ModalHeader>
            {values?.type === "IMAGE" ? (
              <Image
                paddingInline="6"
                src={values?.file ? URL.createObjectURL(values.file) : null}
                alt={values?.title ? values.title : null}
              />
            ) : (
              <video
                src={values?.file ? URL.createObjectURL(values.file) : null}
                controls
                width="100%"
                height="auto"
              />
            )}
            <VStack mt="5" mb="5" paddingInline="6" spacing={1} align="start">
              <Text fontWeight="700" fontSize="lg">
                Title: {values.title}
              </Text>
              <Text fontWeight="700">Description: {values.description}</Text>
            </VStack>
            <Divider paddingTop="2" />
            <Checkbox
              paddingInline="6"
              name="confirmSubmit"
              isChecked={confirmSubmit}
              onChange={(e) => setConfirmSubmit(e.target.checked)}
              className={styles.inputStyle}
            >
              I understand that once published, I won&apos;t be able to update
              the details of the media.
            </Checkbox>
          </>
        );

      default:
        return <></>;
    }
  };

  return (
    <>
      <Button color="black" bg="white" borderRadius="5" onClick={onOpen}>
        <Icon as={IoDiamondOutline} style={{ marginRight: "0.5em" }} /> Create
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setValues(initialValues);
          setStep(0);
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent bg="#1F1F1F" color="#FFFFFF">
          <ModalCloseButton />
          {renderStep()}
          <ModalFooter color="#000">
            {step > 0 ? (
              <Button mr="8px" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <></>
            )}
            <Button
              bg="white"
              color="black"
              isLoading={submitting}
              loadingText="Publishing"
              onClick={handleSubmit}
            >
              {step === steps.length - 1 ? "Publish Now" : "Next"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
