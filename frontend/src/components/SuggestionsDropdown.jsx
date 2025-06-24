import React from 'react';
import {
    List,
    Box
} from '@chakra-ui/react';

const SuggestionsDropdown = ({ suggestions, onSelect }) => {
    if (!suggestions.length) {
        return null;
    }

    return (
        <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            // bg="gray.800"
            bg="linear-gradient(to bottom, #1a1a2e, #16213e)"
            width="85vw"
            border="1px solid"
            borderColor="gray.600"
            borderRadius="md"
            mt={1}
            zIndex="dropdown"
            boxShadow="lg"
        >
            <List.Root spacing={1} p={2}>
                {suggestions.map((suggestion, index) => (
                    <List.Item
                        key={index}
                        p={3}
                        listStyle="none"
                        cursor="pointer"
                        borderRadius="md"
                        textAlign="left"
                        _hover={{ bg: 'gray.700' }}
                        onClick={() => onSelect(suggestion)}
                    >
                        {suggestion}
                    </List.Item>
                ))}
            </List.Root>
        </Box>
    );
};

export default SuggestionsDropdown;
