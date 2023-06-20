import React from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import RenderHtml, { MixedStyleDeclaration, defaultSystemFonts } from 'react-native-render-html'

import { vars } from '@holi/ui/styles/globalVars'

import tagsStyles from './styles'

export type HoliHtmlViewProps = {
  html: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView = ({ html, style, testID }: HoliHtmlViewProps) => {
  if (!html) return null

  // https://meliorence.github.io/react-native-render-html/docs/intro
  return (
    // TODO: process links
    <RenderHtml
      contentWidth={500}
      source={{ html: html }}
      baseStyle={StyleSheet.flatten(style) as MixedStyleDeclaration}
      tagsStyles={tagsStyles}
      enableCSSInlineProcessing={false}
      systemFonts={[...defaultSystemFonts, vars.fontFamilyMobile]}
      defaultViewProps={{
        testID,
      }}
    />
  )
}

export default HoliHtmlView
