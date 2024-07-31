import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet } from 'react-native'

import { GradientBackgroundProps } from './types'

const GradientBackground = ({ colors }: GradientBackgroundProps) => (
  <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
)

export default GradientBackground
