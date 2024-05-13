import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import './styles.css'

export type HoliHtmlViewProps = {
  html: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView = ({ html, style, testID }: HoliHtmlViewProps) => {
  if (!html) return null

  return (
    <View style={[styles.htmlView, style]} testID={testID}>
      <div dangerouslySetInnerHTML={{ __html: html }} className="html-view" />
    </View>
  )
}

export default HoliHtmlView

const styles = StyleSheet.create({
  htmlView: {
    borderStyle: 'solid',
    borderWidth: 0,
  },
})
