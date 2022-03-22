import React from 'react'
import { StyleSheet, SafeAreaView, View, ScrollView, ImageBackground } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import type { NavigationStackScreensList } from 'shared/components/navigation/NavigationDrawer'
import { useNavigation } from '@react-navigation/native'
import Button from 'shared/components/ui/Button'
import Holicon from 'shared/components/ui/holicon'
import theme from 'shared/styles/theme'

type SpaceLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}
type NavigationProps = NavigationProp<NavigationStackScreensList>

const SpaceLayout: React.FunctionComponent<SpaceLayoutProps> = (props: SpaceLayoutProps) => {
  const navigation = useNavigation<NavigationProps>()

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2016/04/12/22/35/watercolour-1325656__480.jpg' }}
      resizeMode="cover"
      style={styles.bgImage}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>{props.children}</ScrollView>
        <View style={styles.footer}>
          {/* TODO: hide within appStore */}
          <Button style={styles.appStoreButton} onPress={() => navigation.navigate('AppStore')}>
            <Holicon icon="appstore" size={30} color="black" />
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default SpaceLayout

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  scrollView: {
  },
  bgImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appStoreButton: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderColor: 'rgba(150,150,150,0.1)',
    alignItems: 'center',
    borderRadius: 30,
  },
})
