import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import AppTile from 'shared/features/spaces/components/AppTile'

type AppTilesProps = {
  style?: ViewStyle
}
const AppTiles: React.FunctionComponent<AppTilesProps> = (props: AppTilesProps) => {
  const apps = [...Array(12).keys()]

  return (
    <View style={[styles.tilesContainer, props.style]}>
      {apps.map((value) => (
        <AppTile value={value} key={value} />
      ))}
    </View>
  )
}

export default AppTiles

const styles = StyleSheet.create({
  tilesContainer: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
    justifyContent: 'space-evenly',
  },
})
