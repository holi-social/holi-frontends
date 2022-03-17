import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import Tile from 'shared/components/space/Tile'

const TilesList: React.FunctionComponent = () => {
  const apps = [...Array(12).keys()]

  return (
    <ScrollView contentContainerStyle={styles.tilesContainer}>
      {apps.map((value) => (
        <Tile value={value} key={value} style={styles.tile} />
      ))}
    </ScrollView>
  )
}

export default TilesList

const styles = StyleSheet.create({
  tilesContainer: {
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
    justifyContent: 'space-evenly',
  },
  tile: {
    width: '33%',
  },
})
