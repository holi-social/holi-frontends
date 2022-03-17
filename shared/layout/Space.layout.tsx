import React from 'react'
import { StyleSheet, SafeAreaView, View, ImageBackground } from 'react-native'
import Button from 'shared/components/ui/Button'
import Holicon from 'shared/components/ui/holicon'
import theme from 'shared/styles/theme'

type SpaceLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const SpaceLayout: React.FunctionComponent<SpaceLayoutProps> = (props: SpaceLayoutProps) => {
  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2016/04/12/22/35/watercolour-1325656__480.jpg' }}
      resizeMode="cover"
      style={styles.bgImage}
    >
      <SafeAreaView style={styles.container}>
        {props.children}

        <View style={styles.footer}>
          <Button style={styles.appStoreButton}>
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
    justifyContent: 'center',
    position: 'relative',
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
    borderTopColor: 'black',
    borderTopWidth: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appStoreButton: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    borderRadius: 30,
  },
})
