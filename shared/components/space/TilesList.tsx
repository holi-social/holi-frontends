import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import Tile from 'shared/components/space/Tile'


type TilesListProps = {
  style?: any
}
const TilesList: React.FunctionComponent<TilesListProps> = (props: TilesListProps) => {
  const apps = [...Array(12).keys()]

  return (
    <ScrollView style={props.style} contentContainerStyle={[styles.tilesContainer]}>
      {apps.map((value) => (
        <Tile value={value} key={value} style={styles.tile} />
      ))}
    </ScrollView>
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
