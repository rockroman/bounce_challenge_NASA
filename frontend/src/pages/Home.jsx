import { Box, Heading, Text, Button, VStack, HStack, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// A few sample space images for the background
const backgroundImages = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=1974&auto=format&fit=crop',
];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Flex
      w="full"
      h="85vh" // Adjust height as needed
      alignItems="center"
      justifyContent="center"
      bgImage={`url(${backgroundImages[currentImageIndex]})`}
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      transition="background-image 1s ease-in-out"
    >
      <VStack
        spacing={6}
        p={8}
        // bg="rgba(1, 1, 1, 0.6)" // Semi-transparent overlay for text readability
        bg="rgba(26, 26, 42, 0.8)"
        borderRadius="lg"
        textAlign="center"
      >
        <Heading size="2xl" fontWeight="bold">
          Your Gateway to Space Exploration
        </Heading>
        <Text fontSize="lg" maxW="2xl">
          Discover the cosmos with stunning images from NASA's archives, get AI-powered analysis, and explore the universe with our natural language search.
        </Text>
        <HStack spacing={4}>
          <Button as={Link} to="/apod"
          //  colorScheme="blue"
           color="gray.100"
           size="lg"
           variant="outline"
           border="solid blue"
           bg="gray.900">
            Picture of the Day
          </Button>
          <Button as={Link} to="/search"
           variant="outline"
           size="lg"
           color="gray.100"
           >
            Search Images
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
};

export default Home;