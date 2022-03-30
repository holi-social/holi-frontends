import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'
import theme from '@holi/shared/styles/theme'
import { Link } from '@holi/shared/components/navigation/Link'

export const DrawerItem: React.VoidFunctionComponent<{
  routeName: string
  label: string
}> = ({ routeName, label }) => (
  <Link to={routeName}>
    {({ isActive, hovered, active, pressed }) => (
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
  </Link>
)

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
