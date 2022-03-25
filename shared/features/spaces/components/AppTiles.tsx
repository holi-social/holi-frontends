import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ViewStyle, Dimensions } from 'react-native'
import AppTile from 'shared/features/spaces/components/AppTile'

type AppTilesProps = {
  style?: ViewStyle
}

const AppTiles: React.FunctionComponent<AppTilesProps> = (props: AppTilesProps) => {
  const apps = [...Array(12).keys()]

  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const window = Dimensions.get('window')
    setWindowWidth(window.width)
  }, [])

  return (
    <View style={[styles.tilesContainer, props.style]}>
      {apps.map((value) => (
        <AppTile value={value} key={value} style={windowWidth > 500 ? styles.bigScreen : styles.smallScreen} />
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
  smallScreen: { width: '50%' },
  bigScreen: { width: '25%' },
})
