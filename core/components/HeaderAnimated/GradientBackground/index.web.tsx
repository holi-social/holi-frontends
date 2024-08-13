import React from 'react'

import { GradientBackgroundProps } from './types'

const GradientBackground = ({ colors }: GradientBackgroundProps) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundImage: `linear-gradient(to bottom, ${colors.map((color) => color).join(', ')})`,
    }}
  />
)

export default GradientBackground
