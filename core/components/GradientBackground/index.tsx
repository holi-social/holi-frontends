import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet } from 'react-native'

import type { GradientBackgroundProps } from './types'

const GradientBackground = ({ colors, start, end }: GradientBackgroundProps) => (
  <LinearGradient
    colors={colors as [string, string, ...string[]]}
    start={start}
    end={end}
    style={StyleSheet.absoluteFill}
  />
)

export default GradientBackground
