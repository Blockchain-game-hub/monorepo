import { 
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
    VStack
} from "@chakra-ui/react";
import React from "react";


export default function PostModal(isOpen: boolean, onClose: any) {
    const initialValues = {
        title: "",
        description: "",
        type: null,
        file: null,
        isPrivate: false,
    };
    const [values, setValues] = React.useState(initialValues)
    const handleChange = (event) => setValues({ ...values, [event.target.name]: event.target.value });
    const setFile = (event) => setValues({ ...values, [event.target.name]: event.target.files[0] });
    const setIsPrivate = (event) => setValues({ ...values, [event.target.name]: event.target.checked });

    // TODO: Add missing membership step
    const steps = ["create", "preview"]
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
        setStep(step + 1);
      } else {
        if (confirmSubmit) {
          setSubmitting(true);
          const formData  = new FormData();
          for(const name in values) {
              formData.append(name, values[name]);
          }
          // TODO: remove hardcoded author
          formData.append('authorId', '1');
  
          const res = await fetch("http://localhost:3000/api/post", {
              method: "POST",
              body: formData,
          });
          // TODO: Show success or error
          setSubmitting(false);
        } else {
          alert("Please confirm that you want to publish");
        }
      }
    };
    
    // FIXME: This doesn't seem to work
    const styles = {
      inputStyle: {
        background: '#262626',
        border: "1px solid #404040",
        boxSizing: "border-box",
        borderRadius: "4px",
      },
      buttonStyle: {
        background: 'transparent',
        border: "1px solid #9C9A9A",
        borderRadius: "4px"
      },
      labelStyle: {
        color: "#BDBDBD"
      }
    }

    const renderStep = () => {
        switch(step) {
            case 0:
                return (
                    <>
                      <ModalHeader fontFamily="Montaga">
                          Create Media
                      </ModalHeader>
                      <ModalBody>
                      <FormControl id="title">
                          <FormLabel className={styles.labelStyle}>Title</FormLabel>
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
                      <FormControl id="description">
                          <FormLabel className={styles.labelStyle}>Description (optional)</FormLabel>
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
                      <FormControl id="file">
                      <FormLabel className={styles.labelStyle}>Upload Attachment (select one)</FormLabel>
                      {
                      values.type === null ? 
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                          p="5"
                          top="0"
                          width="100%"
                          height="5em"
                        >
                        <Button
                          name="type"
                          value="IMAGE"
                          onClick={handleChange}
                          colorScheme={values.type === "IMAGE" ? "blue" : "transparent"}
                          borderRadius="4px"
                          border="1px solid"
                          borderColor={values.type === "IMAGE" ? "transparent" : "#9C9A9A"}
                        >Image</Button>
                        <Button
                          name="type"
                          value="TEXT"
                          onClick={handleChange}
                          colorScheme={values.type === "TEXT" ? "blue" : "transparent"}
                          borderRadius="4px"
                          border="1px solid"
                          borderColor={values.type === "TEXT" ? "transparent" : "#9C9A9A"}
                        >Text</Button>
                        <Button
                          name="type"
                          value="AUDIO"
                          onClick={handleChange}
                          colorScheme={values.type === "AUDIO" ? "blue" : "transparent"}
                          borderRadius="4px"
                          border="1px solid"
                          borderColor={values.type === "AUDIO" ? "transparent" : "#9C9A9A"}
                        >Audio</Button>
                        <Button
                          name="type"
                          value="VIDEO"
                          onClick={handleChange}
                          colorScheme={values.type === "VIDEO" ? "blue" : "transparent"}
                          borderRadius="4px"
                          border="1px solid"
                          borderColor={values.type === "VIDEO" ? "transparent" : "#9C9A9A"}
                        >Video</Button>
                    </Flex>
                  : 
                  // TODO: Style this better
                    <Input
                      name="file"
                      onChange={setFile}
                      type="file"
                      className={styles.inputStyle}
                    />
                  }
                          
                      </FormControl>
                      <FormControl id="restrict">
                          <FormLabel className={styles.labelStyle}>Restrict Media to Members-Only</FormLabel>
                          <Checkbox 
                              name="isPrivate"
                              isChecked={values.isPrivate}
                              onChange={setIsPrivate}
                              className={styles.inputStyle}
                              >Enabled</Checkbox>
                      </FormControl>
                      </ModalBody>
                    </>
          )
          case 1:
            return (
              <>
                <ModalHeader fontFamily="Montaga">
                  Preview
                </ModalHeader>
                <Image paddingInline="6" src={URL.createObjectURL(values.file)} alt={values.title} />
                <VStack paddingInline="6" spacing={1} align="start">
                  <Text fontSize="lg">{values.title}</Text>
                  <Text>{values.description}</Text>
                </VStack>
                <Divider paddingTop="2" />
                <Checkbox 
                  paddingInline="6"
                  name="confirmSubmit"
                  isChecked={confirmSubmit}
                  onChange={(e) => setConfirmSubmit(e.target.checked)}
                  className={styles.inputStyle}
                  >I understand that once published, I won&apos;t be able to update the details of the media.</Checkbox>
              </>
            )

          default:
            return (
              <>
              </>
            )
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#1F1F1F" color="#FFFFFF">
            <ModalCloseButton />
            {renderStep()}
            <ModalFooter color="#000">
              {
                step > 0 ?
                <Button mr="8px" onClick={()=>setStep(step-1)}>
                  Back</Button>
                : <></>
              }
              <Button 
                isLoading={submitting}
                loadingText="Publishing"
                onClick={handleSubmit}
              >
                  {step === steps.length - 1 ? "Publish Now" : "Next"}
              </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    );
}
    