import React from 'react'
import { View, Text, StyleSheet, ViewStyle, Pressable, Platform } from 'react-native'
import tinycolor from 'tinycolor2'
import theme from '@holi/ui/styles/theme'
import useRouting from '@holi/ui/components/navigation/useRouting'

type PressableCallbackProps = {
  hovered: boolean
  active: boolean
  pressed: boolean
}

export const LinkItem: React.VoidFunctionComponent<{
  routeName: string
  label: string
}> = ({ routeName, label }) => {
  const { navigate, pathname, toggleDrawer } = useRouting()
  const isActive = React.useMemo(() => pathname === routeName, [pathname, routeName])
  const onPress = () => {
    if (Platform.OS === 'web') {
      // mobile toggling is handled by reactnavigation (would be duplicate though)
      toggleDrawer()
    }
    navigate(routeName)
  }

  return (
    <Pressable onPress={onPress}>
      {({ hovered, active, pressed }: PressableCallbackProps) => (
        <View
          style={[
            styles.container,
            isActive && styles.isActive,
            (active || hovered) && styles.hovered,
            pressed && styles.pressed,
          ]}
        >
          <Text>{label}</Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create<{
  container: ViewStyle
  isActive: ViewStyle
  active: ViewStyle
  hovered: ViewStyle
  pressed: ViewStyle
}>({
  container: {
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundGrey,
  },
  isActive: {
    backgroundColor: tinycolor(theme.colors.backgroundGrey).darken(15).toString(),
  },
  active: {},
  hovered: {
    backgroundColor: tinycolor(theme.colors.backgroundGrey).darken(15).toString(),
  },
  pressed: {
    opacity: 0.8,
  },
})
