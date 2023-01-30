import React, { useState } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import loadLocalResource from 'react-native-local-resource'
import RenderHtml, { MixedStyleDeclaration, defaultSystemFonts } from 'react-native-render-html'

import { colors, vars } from '@holi/ui/styles/globalVars'

export type importRef = string

export type HoliHtmlViewProps = {
  source: importRef
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView: React.VFC<HoliHtmlViewProps> = ({ source, style, testID }) => {
  const [html, setHtml] = useState('')

  loadLocalResource(source).then((myResourceContent: string) => {
    setHtml(myResourceContent)
  })

  const tagsStyles: Record<string, MixedStyleDeclaration> = {
    body: {
      color: colors.fontColor,
    },
    h1: {
      marginBottom: 30,
    },
    h2: {
      marginBottom: 20,
    },
    a: {
      color: colors.fontColorHighlighted,
    },
    p: {
      padding: 0,
      margin: 0,
      marginBottom: 20,
    },
    ul: {
      marginTop: 0,
    },
  }

  // https://meliorence.github.io/react-native-render-html/docs/intro
  return (
    // TODO: process links
    <RenderHtml
      contentWidth={200}
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
