import React from 'react';
import {
    Box,
    SimpleGrid,
    Image,
    Text,
    VStack,
    Badge,
    Skeleton,
    Dialog,
    Portal,
    CloseButton,
    Container, // Import Container
    Center, // Import Center
} from '@chakra-ui/react';
import RocketSpinner from './RocketSpinner'; // Import RocketSpinner

const NasaImageResults = ({ results, loading, error }) => {
    const [selectedImage, setSelectedImage] = React.useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    if (loading) {
        return (
            <Container centerContent p={8}>
                <Center>
                    <RocketSpinner size="xl" />
                </Center>
            </Container>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" p={4}>
                <Text color="red.500">{error}</Text>
            </Box>
        );
    }

    if (!results?.length) {
        return (
            <Box textAlign="center" p={4}>
                <Text>No images found. Try a different search term.</Text>
            </Box>
        );
    }

    return (

        <Box
        >
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} p={4} gap={3}>
                {results.map((image) => (
                    <Box
                        key={image.nasaId}
                        borderRadius="lg"
                        overflow="hidden"
                        bg="rgba(0, 0, 0, 0.5)"
                        transition="transform 0.2s"
                        cursor="pointer"
                        _hover={{ transform: 'scale(1.02)' }}
                        onClick={() => handleImageClick(image)}
                    >
                        <Image
                            src={image.thumbnail}
                            alt={image.title}
                            width="100%"
                            height="250px"
                            objectFit="cover"
                            fallbackSrc="https://via.placeholder.com/300x200?text=Loading..."
                            border="1px solid #3a3636"
                            rounded="md"
                        />
                        <VStack p={4} align="start" spacing={2}>
                            <Text fontWeight="bold" noOfLines={1}>
                                {image.title}
                            </Text>
                            <Text fontSize="sm" color="gray.400" noOfLines={2} textAlign="left">
                                {image.description}
                            </Text>
                            <Badge colorScheme="blue">
                                {new Date(image.dateCreated).getFullYear()}
                            </Badge>
                        </VStack>
                    </Box>
                ))}
            </SimpleGrid>

            <Dialog.Root open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}

                >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner

                    >
                        <Dialog.Content
                            bg="gray.900" maxW="4xl"
                            borderWidth="2px"
                            borderColor="gray.600"
                            borderRadius="md">
                            <Dialog.Header>
                                <Dialog.Title color="white">{selectedImage?.title}</Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" color="white" />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body pb={6}>
                                <Image
                                    src={selectedImage?.imageUrl || selectedImage?.thumbnail}
                                    alt={selectedImage?.title}
                                    width="100%"
                                    maxH="600px"
                                    objectFit="contain"
                                />
                                <Text mt={4} color="white" textAlign="left">
                                    {selectedImage?.description}
                                </Text>
                                <Text mt={2} fontSize="sm" color="gray.400">
                                    Date: {selectedImage?.dateCreated ?
                                        new Date(selectedImage.dateCreated).toLocaleDateString()
                                        : 'N/A'}
                                </Text>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Box>
    );
};

export default NasaImageResults;