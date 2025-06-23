import React from 'react';
import { Box, Icon } from '@chakra-ui/react';
import { MdRocketLaunch } from 'react-icons/md';
import { keyframes } from '@emotion/react';

//  keyframes for the spinning animation
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const RocketSpinner = ({ size = 'xl' }) => {
  const sizeProps = {
    sm: { boxSize: 8 },
    md: { boxSize: 12 },
    lg: { boxSize: 16 },
    xl: { boxSize: 24 },
  };

  // Apply the animation to the Box component's `animation` prop
  const animation = `${spin} 1.5s linear infinite`;

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      border="2px solid"
      borderColor="blue.400"
      p={1}
      {...sizeProps[size]}
    >
      <Box
        display="inline-block"
        animation={animation}
        w="full"
        h="full"
      >
        <Icon as={MdRocketLaunch} w="full" h="full" color="blue.400" />
      </Box>
    </Box>
  );
};

export default RocketSpinner;
