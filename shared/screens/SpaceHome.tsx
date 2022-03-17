import React from 'react'
import { SafeAreaView, View, ImageBackground, Text } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { NavigationStackScreensList } from 'shared/components/navigation/NavigationDrawer'
import TilesList from 'shared/components/space/TilesList'
import Button from 'shared/components/ui/Button'
import Holicon from 'shared/components/ui/holicon'

import styles from './SpaceHome.style'

export type HomeScreenProps = NativeStackScreenProps<NavigationStackScreensList, 'Home'>

const HomeScreen: React.VoidFunctionComponent<HomeScreenProps> = ({ navigation }) => {


  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2016/04/12/22/35/watercolour-1325656__480.jpg' }}
      resizeMode="cover"
      style={styles.bgImage}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Hello Anna</Text>
        <Text style={styles.subHeader}>Nice to see you here!</Text>

        <TilesList />

        <View style={styles.footer}>
          <Button style={styles.appStoreButton}>
            <Holicon icon="appstore" size={30} color="black" />
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default HomeScreen
