import React from 'react'
import { ColorPalette, ColorItem } from '@storybook/addon-docs/blocks'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import { darkTheme } from 'holi-bricks/foundations/colors/themes/dark'

export const SemanticColorsLight = () => {
  return (
    <ColorPalette>
      <ColorItem title="bg" colors={lightTheme.colors.bg} subtitle="" />
      <ColorItem title="fill" colors={lightTheme.colors.fill} subtitle="" />
      <ColorItem title="border" colors={lightTheme.colors.border} subtitle="" />
      <ColorItem title="decorative" colors={lightTheme.colors.decorative} subtitle="" />
    </ColorPalette>
  )
}

export const SemanticColorsDark = () => {
  return (
    <ColorPalette>
      <ColorItem title="bg" colors={darkTheme.colors.bg} subtitle="" />
      <ColorItem title="fill" colors={darkTheme.colors.fill} subtitle="" />
      <ColorItem title="border" colors={darkTheme.colors.border} subtitle="" />
      <ColorItem title="decorative" colors={darkTheme.colors.decorative} subtitle="" />
    </ColorPalette>
  )
}
