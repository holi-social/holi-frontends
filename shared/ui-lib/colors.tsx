import * as React from 'react';
import { Box, Heading, Center, HStack, ScrollView } from 'native-base';


export default function Colors() {

  const colors = ['primary', 'secondary', 'tertiary', 'danger', 'error', 'success', 'warning', 'muted', 'info', 'light', 'rose']
  const variations = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

  return (
    <Box flex="1" safeAreaTop>
      <Heading mt={3} color="red.700">Colors</Heading>

      <ScrollView borderWidth="1" borderColor="info.500">
        {colors.map(color => (
          <Box key={color} mt="5" mx="0" p="0" w="100%">
            <Heading color="dark.300">{color}</Heading>
            <HStack justifyContent="flex-start" flexWrap="wrap" m="0" p="0">
              {variations.map(variation => (
                <Box key={`${color}.${variation}`} mt={2} mr={0.5} borderRadius="md" bg={`${color}.${variation}`} width={100} height={30} justifyContent="center">
                  <Center>{`${color}.${variation}`}</Center>
                </Box>
              ))}
            </HStack>
          </Box>
        ))}
      </ScrollView>
    </Box>
  );
}