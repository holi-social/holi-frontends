import * as React from 'react';
import { useState } from 'react';
import { navigationRef, navigate } from './rootNavigation';
import { Pressable, Center, HStack, Text } from 'native-base';


export default function FooterNavigation() {


  // das ist alles Quatch !!!!!
  const getPage = () => {
    if (!navigationRef || !navigationRef.isReady()) {
      return ''
    }
    const currRoute = navigationRef.getCurrentRoute()
    return currRoute ? currRoute.name : ''
  }

  const initialPage = getPage()
  const [currentPage, setCurrentPage] = useState(initialPage)

  const gotoPage = (page: string) => {
    navigate(page)
    setCurrentPage(page)
  }

  return (
    <HStack bg="indigo.600" alignItems="center" safeAreaBottom shadow={6} py="2">
      <Pressable opacity={currentPage === 'Home' ? 1 : 0.5} py="3" flex={1} onPress={() => gotoPage('Home')}>
          <Center>
            {/* <Icon mb="1" as={<MaterialCommunityIcons name={currentPage === 0 ? "home" : "home-outline"} />} color="white" size="sm" /> */}
            <Text color="white" fontSize="12">
              Home
            </Text>
          </Center>
        </Pressable>
        <Pressable opacity={currentPage === 'Colors' ? 1 : 0.5} py="2" flex={1} onPress={() => gotoPage('Colors')}>
          <Center>
            {/* <Icon mb="1" as={<MaterialIcons name="search" />} color="white" size="sm" /> */}
            <Text color="white" fontSize="12">
              Colors
            </Text>
          </Center>
        </Pressable>
    </HStack>
  );
}
