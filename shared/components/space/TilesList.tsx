import React from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import theme from 'shared/styles/theme'

const TilesList: React.FunctionComponent = () => {
  const apps = [...Array(12).keys()]

  return (
    <ScrollView contentContainerStyle={styles.tilesContainer}>
      {apps.map((value) => (
        <View style={styles.tile} key={value}>
          <Text>{value + 1}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default TilesList

const styles = StyleSheet.create({
  tilesContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: '#0f0',
  },
  tile: {
    width: '25%',
    height: 100,
    backgroundColor: theme.colors.primary,
    marginLeft: 5,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 5,
  },
})
