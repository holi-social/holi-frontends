import React, { memo } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import RenderHtml, { type MixedStyleDeclaration, defaultSystemFonts } from 'react-native-render-html'

import { useTheme } from '@holi/ui/styles/theme'

import getStyles from './styles'

export type HoliHtmlViewProps = {
  html: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView = ({ html, style, testID }: HoliHtmlViewProps) => {
  const { theme } = useTheme()

  if (!html) return null

  const tagsStyles = getStyles(theme)

  // https://meliorence.github.io/react-native-render-html/docs/intro
  return (
    // TODO: process links
    <RenderHtml
      contentWidth={500}
      source={{ html: html }}
      baseStyle={StyleSheet.flatten(style) as MixedStyleDeclaration}
      tagsStyles={tagsStyles}
      enableCSSInlineProcessing={false}
      systemFonts={[...defaultSystemFonts, theme.fontFamily.default('Medium'), theme.fontFamily.default('Regular')]}
      defaultViewProps={{
        testID,
      }}
    />
  )
}

export default memo(HoliHtmlView)
