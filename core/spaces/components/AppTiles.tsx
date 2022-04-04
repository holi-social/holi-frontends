import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import AppTile from '@holi/core/spaces/components/AppTile'

import dummyApps from './dummy_data.json'

type AppTilesProps = {
  style?: ViewStyle
}

const AppTiles: React.FunctionComponent<AppTilesProps> = (props: AppTilesProps) => {
  // const apps = [...Array(12).keys()]

  return (
    <View style={[styles.tilesContainer, props.style]}>
      {dummyApps.map((appItem, index) => (
        <AppTile appData={appItem} key={`${index}_${appItem.title}`} />
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
