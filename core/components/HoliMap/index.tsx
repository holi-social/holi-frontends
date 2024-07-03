import React, { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import Svg, { Circle } from 'react-native-svg'

import { MapProps, PinProps } from './types'

export const HoliMap = ({ center, children }: PropsWithChildren<MapProps>) => {
  const initialVisibleMapWidthDegrees = 0.03
  const initialVisibleMapHeightDegrees = 0.03

  return (
    <MapView
      region={{
        ...center,
        latitudeDelta: initialVisibleMapWidthDegrees,
        longitudeDelta: initialVisibleMapHeightDegrees,
      }}
      style={styles.map}
    >
      {children}
    </MapView>
  )
}

export const HoliPin = ({ location }: PinProps) => {
  return (
    <Marker coordinate={location} anchor={{ x: 0.5, y: 0.5 }}>
      <Svg width="100%" height="100%" viewBox="0 0 80 80">
        <Svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Circle opacity="0.32" cx="40" cy="40" r="39" fill="#8B95FF" stroke="#6267E7" stroke-width="2" />
          <Circle cx="40" cy="40" r="9" fill="#6267E7" stroke="white" stroke-width="2" />
        </Svg>
      </Svg>
    </Marker>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
})
