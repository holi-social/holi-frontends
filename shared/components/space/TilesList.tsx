import React from 'react'
import { StyleSheet, View } from 'react-native'
import Tile from 'shared/components/space/Tile'

type TilesListProps = {
  style?: any
}
const TilesList: React.FunctionComponent<TilesListProps> = (props: TilesListProps) => {
  const apps = [...Array(12).keys()]

  return (
    <View style={[styles.tilesContainer, props.style]}>
      {apps.map((value) => (
        <Tile value={value} key={value} style={styles.tile} />
      ))}
    </View>
  )
}

export default TilesList

const styles = StyleSheet.create({
  tilesContainer: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
    justifyContent: 'space-evenly',
  },
  tile: {
    width: '50%',
  },
})
