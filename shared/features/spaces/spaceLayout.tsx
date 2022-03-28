import React from 'react'
import { StyleSheet, SafeAreaView, View, ScrollView, ImageBackground } from 'react-native'
import tinycolor from 'tinycolor2'
import useRouting from 'shared/components/navigation/useRouting'
import Button from 'shared/components/ui/Button'
import Holicon from 'shared/components/ui/holicon'
import theme from 'shared/styles/theme'

type SpaceLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const SpaceLayout: React.FunctionComponent<SpaceLayoutProps> = (props: SpaceLayoutProps) => {
  const { navigate } = useRouting()

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
          <Button style={styles.appStoreButton} onPress={() => navigate('/appstore')}>
            <Holicon icon="appstore" size={30} color="black" style={{ position: 'absolute' }} />
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
    marginTop: 100,
  },
  scrollView: {},
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
    backgroundColor: tinycolor(theme.colors.background).setAlpha(0.2).toString(),
    borderColor: tinycolor(theme.colors.border).setAlpha(0.5).toString(),
    alignItems: 'center',
    borderRadius: 30,
  },
})
