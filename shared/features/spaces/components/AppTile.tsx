import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Pressable, Platform, Dimensions } from 'react-native'
import useRouting from 'shared/components/navigation/useRouting'
import SharedImage from 'shared/components/ui/sharedImage'
import { HoliTheme, useTheme } from 'shared/styles/theme'

type AppTileProps = {
  value: number
  style?: Record<string, unknown>
}

const AppTile: React.FunctionComponent<AppTileProps> = (props: AppTileProps) => {
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const [hasDarkBackground, setHasDarkBackground] = useState(false)
  const [tileSize, setTileSize] = useState(160)
  const styles = getStyles(hasDarkBackground, tileSize, theme)

  useEffect(() => {
    setHasDarkBackground(!!(props.value % 3))
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

  return (
    <View style={[styles.container, props.style]}>
      <Pressable style={styles.tile} onPress={() => navigate('/community')}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <SharedImage imageFile={require('shared/assets/img/icons/betterplace.png')} style={styles.logoImg} />
          </View>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.headerText}>
            Community
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentHeadline}>Neue Beiträge:</Text>
          <Text style={styles.contentText}>{props.value + 3} neue Beiträge</Text>
        </View>

        <View style={styles.badge} />
      </Pressable>
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
      backgroundColor: hasDarkBackground ? theme.colors.secondary : theme.colors.background,
      borderRadius: 15,
      padding: 10,
      width: tileSize,
      maxWidth: '100%',
      height: tileSize,
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
      backgroundColor: hasDarkBackground ? theme.colors.background : theme.colors.backgroundGrey,
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
      color: hasDarkBackground ? theme.colors.textWhite : theme.colors.text,
    },
    contentHeadline: {
      color: hasDarkBackground ? theme.colors.textWhite : theme.colors.textGrey,
      fontSize: 15,
      fontWeight: '500',
    },
    contentText: {
      fontSize: 20,
      fontWeight: '500',
      marginTop: 5,
      color: hasDarkBackground ? theme.colors.textWhite : theme.colors.text,
    },
    badge: {
      width: 18,
      height: 18,
      borderWidth: 2,
      borderColor: theme.colors.background,
      borderRadius: 9,
      backgroundColor: theme.colors.primary,
      position: 'absolute',
      top: -3,
      right: -3,
    },
  })
