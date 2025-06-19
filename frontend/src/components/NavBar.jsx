import React, { useState } from 'react'
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
  { name: 'About', href: '/about' },
]

const NavBar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Flex
        bg="rgba(0, 0, 0, 0.8)"
        color="white"
        minH="60px"
        py={2}
        px={4}
        align="center"
        justify="space-between">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          bg="gray.200"
          bgClip="text">
          NASA Explorer
        </Text>

        <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
          <Drawer.Trigger asChild>
            <Button variant="outline" color="white">
              Menu
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
                      href={link.href}
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
