import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import theme from 'shared/styles/theme'


type TileProps = {
  value: number
  style?: Record<string, unknown>
}
const Tile: React.FunctionComponent<TileProps> = (props: TileProps) => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.tile}>
        <Text>{props.value + 1}</Text>
      </View>
      <View style={styles.badge} />
    </View>
  )
}

export default Tile

const styles = StyleSheet.create({
  container: {
    paddingTop: 5, // needed for badge
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tile: {
    width: '90%',
    height: 150,
    backgroundColor: theme.colors.background,
    borderRadius: 15,
    padding: 10,
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
