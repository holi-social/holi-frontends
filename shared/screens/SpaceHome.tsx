import React from 'react'
import { SafeAreaView, ScrollView, View, ImageBackground, Text } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { NavigationStackScreensList } from 'shared/components/navigation/NavigationDrawer'
import Button from 'shared/components/ui/Button'
import Holicon from 'shared/components/ui/holicon'

import styles from './SpaceHome.style'

export type HomeScreenProps = NativeStackScreenProps<NavigationStackScreensList, 'Home'>

const HomeScreen: React.VoidFunctionComponent<HomeScreenProps> = ({ navigation }) => {

    const apps = [...Array(12).keys()]

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2016/04/12/22/35/watercolour-1325656__480.jpg' }}
      resizeMode="cover"
      style={styles.bgImage}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Hello Anna</Text>
        <Text style={styles.subHeader}>Nice to see you here!</Text>

        <ScrollView contentContainerStyle={styles.tilesContainer}>
          {apps.map((value) => (
            <View style={styles.tile} key={value}>
              <Text>{value + 1}</Text>
            </View>
          ))}
        </ScrollView>

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
