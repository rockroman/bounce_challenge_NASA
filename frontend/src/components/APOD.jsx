import { useState, useEffect } from 'react';

import axios from '../api/axiosDefault';
import {
    Box,
    Button,
    Text,
    Image,
    Container,
    Alert,
    VStack,
    Center,
} from "@chakra-ui/react";
import RocketSpinner from './RocketSpinner';

const APOD = () => {
    const [apodData, setApodData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        const fetchAPOD = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/apod`);
                console.log("response ",response)
                setApodData(response.data);
            } catch (err) {
                setError('Failed to fetch astronomy picture of the day');
                console.error('APOD fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAPOD();
    }, []);

    const handleAnalyze = async () => {
        try {
            setAnalyzing(true);
            const response = await axios.post('/api/analyze-image', {
                imageUrl: apodData.url
            });
            //  the description text  Clean up-remove markdown
            const cleanDescription = response.data.description
            // sorting markdown returned
                .replace(/[#*`]/g, '')
                //  newlines with double newlines
                .replace(/\n{3,}/g, '\n\n')
                .trim();
            setAnalysis({ ...response.data, description: cleanDescription });
        } catch (err) {
            console.error('Analysis error:', err);
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <Container centerContent p={8}>
                <RocketSpinner size="xl" />
                <Text mt={4}>Loading...</Text>
            </Container>
        );
    }

    if (error) {
        return (
            <Container centerContent p={8}>
                <Alert status="error">

                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxW="4xl" p={4}>
            <VStack spacing={6} align="stretch">
                {/* Title */}
                <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    {apodData?.title}
                </Text>

                <Text fontSize="md" color="gray.400">
                    Date: {apodData?.date}
                </Text>

                {/* Image */}
                <Box>
                    {apodData?.media_type === 'image' ? (
                        <Image
                            src={apodData.url}
                            alt={apodData.title}
                            maxH="500px"
                            w="100%"
                            objectFit="contain"
                            loading="lazy"
                            borderRadius="md"
                            mx="auto"

                        />
                    ) : (
                        <iframe
                            src={apodData.url}
                            title="Space Video"
                            height="400px"
                            width="100%"
                            style={{ borderRadius: '8px' }}
                            allowFullScreen
                        />
                    )}
                </Box>

                {/* Analysis Button */}
                <Center>
                    <Button
                        colorScheme="blue"
                        onClick={handleAnalyze}
                        bg="blue.800"
                        border="2px solid gray"
                        isLoading={analyzing}
                        loadingText="Analyzing image..."
                        size="xl"
                        fontWeight="900"
                        width="200px"
                        marginY="2%"
                    >
                        Get AI Analysis
                    </Button>
                </Center>

                {analyzing && (
                    <Center p={4}>
                        <VStack>
                            <RocketSpinner size="lg" />
                            <Text color="gray.600">AI is analyzing the image...</Text>
                        </VStack>
                    </Center>
                )}

                {analysis && !analyzing && (
                    <Box
                        p={6}
                        bg="rgba(0, 0, 0, 0.5)"
                        margin='auto'
                        borderRadius="lg"
                        boxShadow="sm"
                        fontSize="md"
                        lineHeight="tall"
                        color="white"
                        border="2px solid gray"
                    >
                        <VStack align="stretch" spacing={4} margin="auto">
                            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
                                Image Analysis
                            </Text>

                            <Text lineHeight="1.8" textAlign="left"
                             whiteSpace="pre-line"
                             >
                                {analysis.description}
                            </Text>

                            <Text fontSize="sm" color="#aaa" pt={2} borderTop="1px" borderColor="whiteAlpha.200">
                                Analysis Cost: €{analysis.usage.costEUR}
                            </Text>
                        </VStack>
                    </Box>
                )}

                {/* Description */}
                <Box marginTop={5}>

                    <Text mt={2} textAlign="left"
                    // width="85vw"
                    margin="auto">
                        {apodData?.explanation}
                    </Text>
                    {apodData?.copyright && (
                        <Text fontSize="xs" color="gray.500" mt={2}>
                            © {apodData.copyright}
                        </Text>
                    )}
                </Box>
            </VStack>
        </Container>
    );
};

export default APOD;