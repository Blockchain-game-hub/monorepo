import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, Input, Text, Textarea, Flex, Checkbox, FormControl,
    FormLabel,} from "@chakra-ui/react";
import React from "react";


export default function PostModal(isOpen: boolean, onClose: any) {
    const [value, setValue] = React.useState("")
    const handleChange = (event) => setValue(event.target.value)
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
            Create Media
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <FormControl id="title">
                <FormLabel>Title</FormLabel>
                <Input
                    value={value}
                    onChange={handleChange}
                    placeholder="What is the title"
                    size="sm"
                    mb="8px"
                />
            </FormControl>
            <FormControl id="description">
                <FormLabel>Description (optional)</FormLabel>
                <Textarea
                    value={value}
                    onChange={handleChange}
                    placeholder="What is this media about"
                    size="sm"
                    type="textarea"
                    mb="8px"
                />
            </FormControl>
            <FormControl id="file">
            <FormLabel>Upload Attachment (select one)</FormLabel>
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    p="5"
                    top="0"
                    width="100%"
                    height="5em"
                >
                    <Button>Image</Button>
                    <Button>Text</Button>
                    <Button>Audio</Button>
                    <Button>Video</Button>
                </Flex>
                <Input
                    type="file"
                />
            </FormControl>
            <FormControl id="restrict">
                <FormLabel>Restrict Media to Members-Only</FormLabel>
                <Checkbox defaultIsChecked>Enabled</Checkbox>
            </FormControl>
            </ModalBody>
            <ModalFooter>
            <Button onClick={onClose}>
                Next
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    );
}
    