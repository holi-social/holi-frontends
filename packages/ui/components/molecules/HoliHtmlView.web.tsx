import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import '@holi/core/static/stylesWeb.scss'

export type HoliHtmlViewProps = {
  html: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView: React.VFC<HoliHtmlViewProps> = ({ html, style, testID }) => {
  const defaultStyles = { borderStyle: 'solid', borderWidth: 0, overflow: 'auto' }

  if (!html) return null

  return (
    <View style={[defaultStyles, style]} testID={testID}>
      <div dangerouslySetInnerHTML={{ __html: html }} className="html-view" />
    </View>
  )
}

export default HoliHtmlView
