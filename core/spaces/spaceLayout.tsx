import React from 'react'
import { StyleSheet, View, ScrollView, ImageBackground } from 'react-native'
import tinycolor from 'tinycolor2'
import useRouting from '@holi/ui/components/navigation/useRouting'
import Button from '@holi/ui/components/Button'
import Holicon from '@holi/ui/components/holicon'
import theme from '@holi/ui/styles/theme'
import { DrawerHeader } from '@holi/core/spaces/navigation/header'
import { jsVars } from '@holi/ui/styles/globalVars'

type SpaceLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const SpaceLayout: React.FunctionComponent<SpaceLayoutProps> = (props: SpaceLayoutProps) => {
  const { navigate, toggleDrawer } = useRouting()

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2016/04/12/22/35/watercolour-1325656__480.jpg' }}
      resizeMode="cover"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>{props.children}</ScrollView>
        <View style={styles.footer}>
          {/* TODO: hide within appStore */}
          <Button style={styles.appStoreButton} onPress={() => navigate('/appstore')}>
            <Holicon icon="appstore" size={30} color="black" style={{ position: 'absolute' }} />
          </Button>
        </View>
        <View style={styles.header}>
          <DrawerHeader toggleDrawer={() => toggleDrawer()} style={{borderWidth: 1, borderColor: 'pink'}} />
        </View>
      </View>
    </ImageBackground>
  )
}

export default SpaceLayout

const styles = StyleSheet.create({
  bgImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  scrollView: {
    marginTop: jsVars.CSS_HEADER_Height,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: jsVars.CSS_HEADER_Height,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appStoreButton: {
    width: 60,
    height: 60,
    backgroundColor: tinycolor(theme.colors.background).setAlpha(0.7).toString(),
    borderColor: tinycolor(theme.colors.border).setAlpha(0.5).toString(),
    alignItems: 'center',
    borderRadius: 30,
  },
})
