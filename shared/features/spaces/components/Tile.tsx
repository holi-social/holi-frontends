import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import useRouting from 'shared/components/navigation/useRouting'
import SharedImage from 'shared/components/ui/sharedImage'
import theme from 'shared/styles/theme'
import { styleVars } from 'shared/styles/globalVars'

type TileProps = {
  value: number
  style?: Record<string, unknown>
}
const Tile: React.FunctionComponent<TileProps> = (props: TileProps) => {
  const [hasDarkBackground, setHasDarkBackground] = useState(false)

  useEffect(() => {
    setHasDarkBackground(!!(props.value % 3))
  }, [])

  const styles = getStyles(hasDarkBackground)

  const { navigate } = useRouting()

  return (
    <View style={[styles.container, props.style]}>
      <Pressable style={styles.tile} onPress={() => navigate('/community')}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <SharedImage
              imageFile={require('shared/assets/img/icons/betterplace.png')}
              style={{ width: 14, height: 14 }}
            />
          </View>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.headerText}>
            Community
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentHeadline}>Neue Beiträge:</Text>
          <Text style={styles.contentText}>{props.value + 3} neue Beiträge</Text>
        </View>
      </Pressable>
      <View style={styles.badge} />
    </View>
  )
}

export default Tile

// const tileBackgroundColor = hasDarkBackground ? theme.colors.primary : theme.colors.background
// const logoBackgroundColor = hasDarkBackground ? theme.colors.background : styleVars.backgroundColorGrey
// const fontColor = hasDarkBackground ? 'white' : theme.colors.text
// const fontColorLight = hasDarkBackground ? 'rgba(255,255,255, 0.8)' : styleVars.fontColorGrey

const getStyles = (hasDarkBackground: boolean) =>
  StyleSheet.create({
    container: {
      paddingTop: 5, // needed for badge
      paddingBottom: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tile: {
      width: '90%',
      height: 160,
      backgroundColor: hasDarkBackground ? theme.colors.primary : theme.colors.background,
      borderRadius: 15,
      padding: 10,
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
      backgroundColor: hasDarkBackground ? theme.colors.background : styleVars.backgroundColorGrey,
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      fontWeight: '500',
      color: hasDarkBackground ? 'white' : theme.colors.text,
    },
    contentHeadline: {
      color: hasDarkBackground ? 'rgba(255,255,255, 0.8)' : styleVars.fontColorGrey,
      fontSize: 15,
      fontWeight: '500',
    },
    contentText: {
      fontSize: 20,
      fontWeight: '500',
      marginTop: 5,
      color: hasDarkBackground ? 'white' : theme.colors.text,
    },
    badge: {
      width: 18,
      height: 18,
      borderWidth: 2,
      borderColor: theme.colors.background,
      borderRadius: 9,
      backgroundColor: theme.colors.tertiary,
      position: 'absolute',
      top: 0,
      right: '2%',
    },
  })
