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
    </View>
  )
}

export default Tile

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  tile: {
    height: 100,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    padding: 10,
  },
})
