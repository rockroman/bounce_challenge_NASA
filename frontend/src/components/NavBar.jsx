import React, { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { MdRocketLaunch } from "react-icons/md";
import { LuNavigation } from "react-icons/lu";
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  CloseButton,
  Drawer,
  Portal,
  Flex,
  Text,
  Link,
} from '@chakra-ui/react'

const LinkItems = [
  { name: 'Home', href: '/' },
  { name: 'Picture of the Day', href: '/apod' },
  { name: 'Image Search', href: '/search' },

]

const NavBar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Flex
        bg="linear-gradient(to bottom, #1a1a2e, #16213e)"
        color="white"
        minH="60px"
        py={2}
        px={4}
        align="center"
        justify="space-between">
        {/* <Text
          fontSize="2xl"
          fontWeight="bold"
          bg="gray.200"
          bgClip="text">
          NASA Explorer
        </Text> */}
        <Link
          key="Home"
          as={RouterLink}
          to="/"
          fontSize="2xl"
          fontWeight="bold"
          color="white"
          _hover={{ color: "blue.300" }}
        >
          NASA Explorer
          </Link>

        <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
          <Drawer.Trigger asChild>
                <Button
                    animation="pulse 3s infinite"
                    // border="red"
                    color="gray.300"
                    bg="rgb(41 72 147 / 89%)"
                    aria-label="Navigation open button"
                    >

                    <MdRocketLaunch
                    size="3%"
                    color='white'

                    // border="red"
                    />
                    </Button>


          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content bg="gray.900">
                <Drawer.Header borderBottomWidth="1px" borderColor="gray.700">
                  <Flex justify="space-between" align="center" width="full">
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      bgGradient="linear(to-r, cyan.400, blue.500)"
                      bgClip="text">
                      NASA Explorer
                    </Text>
                    <Drawer.CloseTrigger asChild>
                      <CloseButton size="lg" color="white" />
                    </Drawer.CloseTrigger>
                  </Flex>
                </Drawer.Header>
                <Drawer.Body>
                  {LinkItems.map((link) => (
                    <Link
                      key={link.name}
                      as={RouterLink}
                      to={link.href}
                      display="block"
                      p="4"
                      color="white"
                      fontSize="lg"
                      onClick={() => setOpen(false)}
                      _hover={{
                        bg: 'whiteAlpha.200',
                        textDecoration: 'none'
                      }}>
                      {link.name}
                    </Link>
                  ))}
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Flex>
    </>
  )
}

export default NavBar
