import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Link } from 'shared/components/navigation/Link'

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
    backgroundColor: '#f2f2f2',
  },
  isActive: {
    backgroundColor: '#c2c2c2',
  },
  active: {},
  hovered: {
    backgroundColor: '#d2d2d2',
  },
  pressed: {
    opacity: 0.8,
  },
})
