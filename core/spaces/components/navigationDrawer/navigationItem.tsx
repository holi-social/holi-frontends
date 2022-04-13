import React from 'react'
import { StyleSheet, ViewStyle, Platform } from 'react-native'
import tinycolor from 'tinycolor2'
import theme from '@holi/ui/styles/theme'
import useRouting from '@holi/ui/components/navigation/useRouting'
import Button from '@holi/ui/components/Button'

export type NaviItemProps = {
  style?: ViewStyle
  routeName: string
  label: string
}

const NaviItem: React.VoidFunctionComponent<NaviItemProps> = (props) => {
  const { navigate, pathname, toggleDrawer } = useRouting()
  const isActive = React.useMemo(() => pathname === props.routeName, [pathname, props.routeName])
  const onPress = () => {
    if (Platform.OS === 'web') {
      // mobile toggling is handled by reactnavigation (would be duplicate though)
      toggleDrawer()
    }
    navigate(props.routeName)
  }

  return (
    <Button fullWidth onPress={onPress} style={[isActive ? styles.isActive : undefined, props.style]}>
      {props.label}
    </Button>
  )
}

export default NaviItem

const styles = StyleSheet.create({
  isActive: {
    backgroundColor: tinycolor(theme.colors.backgroundGrey).darken(15).toString(),
  },
})
