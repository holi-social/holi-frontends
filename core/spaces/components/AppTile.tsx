import React, { useEffect, useState } from 'react'
import { Dimensions, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import useRouting from '@holi/ui/components/navigation/useRouting'
import SharedImage from '@holi/ui/components/sharedImage'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface AppData {
  title: string
  icon: string
  backgroundImg?: string
  text1?: string
  text2?: string
  linkTo: string
  testID: string
}

type AppTileProps = {
  appData: AppData
  style?: Record<string, unknown>
}

const AppTile: React.FunctionComponent<AppTileProps> = (props: AppTileProps) => {
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const [hasDarkBackground, setHasDarkBackground] = useState(false)
  const [tileSize, setTileSize] = useState(160)
  const [hasNotification, setHasNotification] = useState(false)
  const styles = getStyles(hasDarkBackground, tileSize, theme)

  useEffect(() => {
    setHasDarkBackground(!!props.appData.backgroundImg)
    setHasNotification(!Math.round(Math.random()))

    const dimensionsWindow = Dimensions.get('window')
    const handleResize = () => {
      const width = window ? window.innerWidth : dimensionsWindow.width
      if (width > 1000) {
        setTileSize(250)
      } else if (width > 800) {
        setTileSize(200)
      } else if (width > 500) {
        setTileSize(180)
      } else {
        setTileSize(160)
      }
    }
    handleResize()

    if (Platform.OS === 'web') {
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (Platform.OS === 'web') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  const tileContent = (
    <>
      <Pressable
        style={[styles.pressable, hasDarkBackground && styles.overlay]}
        onPress={() => navigate(props.appData.linkTo)}
      >
        <View style={styles.header} testID={props.appData.testID}>
          <View style={styles.logo}>
            {/* TODO: dynamic app icon */}
            <SharedImage
              imageFile={require('@holi/ui/assets/img/icons/betterplace.png')}
              style={styles.logoImg}
              altText={props.appData.title}
            />
          </View>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.headerText} allowFontScaling={false}>
            {props.appData.title}
          </Text>
        </View>
        <View style={styles.content} allowFontScaling={false}>
          {props.appData.text1 && (
            <Text style={styles.contentHeadline} allowFontScaling={false}>
              {props.appData.text1}
            </Text>
          )}
          {props.appData.text2 && (
            <Text style={styles.contentText} ellipsizeMode="tail" numberOfLines={3} allowFontScaling={false}>
              {props.appData.text2}
            </Text>
          )}
        </View>
      </Pressable>
      {hasNotification && <View style={styles.badge} />}
    </>
  )

  const hasBackgroundImage = typeof props.appData.backgroundImg !== 'undefined'
  return (
    <View style={[styles.container, props.style]}>
      {hasBackgroundImage ? (
        <ImageBackground
          style={styles.tile}
          imageStyle={styles.imageView}
          source={{ uri: props.appData.backgroundImg }}
          resizeMode="cover"
        >
          {tileContent}
        </ImageBackground>
      ) : (
        <View style={styles.tile}>{tileContent}</View>
      )}
    </View>
  )
}

export default AppTile

const getStyles = (hasDarkBackground: boolean, tileSize: number, theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      paddingTop: 5, // needed for badge
      paddingBottom: 40,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Math.floor((tileSize - 150) / 10),
      maxWidth: '46%',
    },
    tile: {
      backgroundColor: hasDarkBackground ? theme.colors.backgroundColorBlack : theme.colors.backgroundColorWhite,
      borderRadius: 15,
      width: tileSize,
      maxWidth: '100%',
      height: tileSize,
    },
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    imageView: {
      borderRadius: 15,
      width: '100%',
    },
    pressable: {
      flex: 1,
      padding: 10,
      borderRadius: 15,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 5,
    },
    logo: {
      backgroundColor: theme.colors.backgroundColorWhite,
      borderWidth: 1,
      borderColor: hasDarkBackground ? theme.colors.borderColorGrey : theme.colors.borderColorBlack,
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImg: {
      width: 15,
      height: 15,
    },
    headerText: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      fontWeight: '500',
      color: hasDarkBackground ? theme.colors.fontColorWhite : theme.colors.fontColorBlack,
    },
    contentHeadline: {
      color: hasDarkBackground ? theme.colors.fontColorWhite : theme.colors.fontColorGrey,
      fontSize: 15,
      fontWeight: '500',
    },
    contentText: {
      fontSize: 20,
      fontWeight: '600',
      marginTop: 5,
      color: hasDarkBackground ? theme.colors.fontColorWhite : theme.colors.fontColorBlack,
    },
    badge: {
      width: 18,
      height: 18,
      borderWidth: 2,
      borderColor: theme.colors.secondaryColor,
      borderRadius: 9,
      backgroundColor: theme.colors.secondaryColor,
      position: 'absolute',
      top: -3,
      right: -3,
    },
  })
