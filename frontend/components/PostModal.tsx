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
    Textarea, 
    Flex, 
    Checkbox, 
    FormControl,
    FormLabel
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

    const handleSubmit = async () => {
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

        console.log(res);
    };

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
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    placeholder="What is the title"
                    size="sm"
                    mb="8px"
                />
            </FormControl>
            <FormControl id="description">
                <FormLabel>Description (optional)</FormLabel>
                <Textarea
                    name="description"
                    value={values.description}
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
                    <Button
                        name="type"
                        value="IMAGE"
                        onClick={handleChange} 
                        colorScheme={values.type === "IMAGE" ? "blue" : "gray"}
                    >Image</Button>
                    <Button
                        name="type"
                        value="TEXT"
                        onClick={handleChange} 
                        colorScheme={values.type === "TEXT" ? "blue" : "gray"}
                    >Text</Button>
                    <Button
                        name="type"
                        value="AUDIO"
                        onClick={handleChange}
                        colorScheme={values.type === "AUDIO" ? "blue" : "gray"} 
                    >Audio</Button>
                    <Button
                        name="type"
                        value="VIDEO"
                        onClick={handleChange} 
                        colorScheme={values.type === "VIDEO" ? "blue" : "gray"}
                    >Video</Button>
                </Flex>
                <Input
                    name="file"
                    onChange={setFile}
                    type="file"
                />
            </FormControl>
            <FormControl id="restrict">
                <FormLabel>Restrict Media to Members-Only</FormLabel>
                <Checkbox 
                    name="isPrivate"
                    isChecked={values.isPrivate}
                    onChange={setIsPrivate}
                    >Enabled</Checkbox>
            </FormControl>
            </ModalBody>
            <ModalFooter>
            <Button onClick={handleSubmit}>
                Next
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    );
}
    