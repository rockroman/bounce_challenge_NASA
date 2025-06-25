import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Heading,
    Input,
    InputGroup,

    Container,
    VStack,
    Text,
    Button,
    List,
    ListItem,
    Flex,

} from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import { LuSearch } from "react-icons/lu"
import axios from '../api/axiosDefault'
import NasaImageResults from '../components/NasaImageResults'
import { Toaster, toaster } from "../components/ui/toaster"
import SuggestionsDropdown from '../components/SuggestionsDropdown'


// Simple debounce function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const ImageSearch = () => {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    // Debounced fetch function
    const debouncedFetchSuggestions = useCallback(
        debounce(async (searchTerm) => {
            if (searchTerm.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await axios.get(`/api/search-suggestions?term=${searchTerm}`);
                setSuggestions(response.data);
            } catch (err) {
                console.error('Failed to fetch suggestions:', err);
                setSuggestions([]);
            }
        }, 300),
        []
    );

    useEffect(() => {
        debouncedFetchSuggestions(query);
    }, [query, debouncedFetchSuggestions]);


    const handleSearch = async (e) => {
        if (e) e.preventDefault()
        if (!query.trim()) return

        setSuggestions([]);
        try {
            setLoading(true)
            setError(null)
            const response = await axios.post('/api/image-search', { query })
            console.log("response results = ",response.data.results)
            setResults(response.data.results)
            setQuery('')
        } catch (err) {
            setError('Failed to fetch images. Please try again.')

            toaster.create({
            title: "Error",
            description: err.message || "Failed to fetch images. Please try again.",
            type: "error",
        })
        } finally {
            setLoading(false)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setSuggestions([]);
    };

    return (
        <Box
             bgImage="url('https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg')"
            bgSize="cover"
            bgPosition="center"
            borderRadius="lg"
            minH="calc(100vh - 60px)"
            py={8}

        >
        <Container maxW="6xl" py={8}
        >
            <VStack spacing={8} align="stretch" marginTop={6}>
                <Box textAlign="center" mt={6}>
                    <Heading size="2xl" mb={4}>NASA Image Search</Heading>
                    <Text color="gray.400" mb={8}>
                        Search through NASA's image database using natural language
                    </Text>
                </Box>

                <Box as="form" onSubmit={handleSearch} position="relative">
                        <Flex align="center" gap={3} width="85vw">
                        <LuSearch color='#74abdf'
                         className='search-icon'
                         cursor="pointer"
                         style={{ flexShrink: 0 }}
                         onClick={handleSearch}/>
                        <InputGroup>
                            <Input
                                placeholder="Show me pictures of Mars rovers from 2020"
                                _placeholder={{ color: "#909eab" }}
                                value={query}
                                variant="outline"
                                size="lg"
                                onChange={(e) => setQuery(e.target.value)}
                                bg="rgba(14, 14, 15, 0.9)"
                                border="1px solid  #496075"
                                borderColor="whiteAlpha.300"
                                _hover={{
                                    borderColor: "whiteAlpha.400"
                                }}
                                _focus={{
                                    borderColor: "blue.500",
                                    boxShadow: "0 0 0 1px #3182ce"
                                }}

                            />
                        </InputGroup>
                    </Flex>
                    <SuggestionsDropdown suggestions={suggestions} onSelect={handleSuggestionClick} />

                </Box>



                <NasaImageResults
                    results={results}
                    loading={loading}
                    error={error}
                />
            </VStack>
        </Container>
    </Box>
    )
}

export default ImageSearch

