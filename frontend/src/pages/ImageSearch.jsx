import React, { useState } from 'react'
import {
    Box,
    Heading,
    Input,
    InputGroup,

    Container,
    VStack,
    Text,
    Button,

} from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import axios from '../api/axiosDefault'
import NasaImageResults from '../components/NasaImageResults'
import { Toaster, toaster } from "../components/ui/toaster"

const ImageSearch = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query.trim()) return

        try {
            setLoading(true)
            setError(null)
            const response = await axios.post('/api/image-search', { query })
            console.log("response results = ",response.data.results)
            setResults(response.data.results)
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

    return (
        <Container maxW="6xl" py={8}>
            <VStack spacing={8} align="stretch" marginTop={6}>
                <Box textAlign="center" >
                    <Heading mb={4}>NASA Image Search</Heading>
                    <Text color="gray.400" mb={8}>
                        Search through NASA's image database using natural language
                    </Text>
                </Box>

                <Box as="form" onSubmit={handleSearch}>
                    <InputGroup size="lg" startElement={<FiSearch color="gray.300" />}>
                        <Input
                            placeholder="'Show me pictures of Mars rovers from 2020' or 'Jupiter's moons'"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            bg="rgba(0, 0, 0, 0.3)"
                            border="1px solid"
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
                    <Button size="sm"
                    onClick={handleSearch}
                    marginTop={3}
                    variant="outline"
                    border="solid gray"
                    color="white"
                    >
                    Search</Button>
                </Box>



                <NasaImageResults
                    results={results}
                    loading={loading}
                    error={error}
                />
            </VStack>
        </Container>
    )
}

export default ImageSearch

