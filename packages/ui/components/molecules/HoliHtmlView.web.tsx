import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import '@holi/core/static/stylesWeb.scss'

export type htmlString = string

export type HoliHtmlViewProps = {
  source: htmlString
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView: React.VFC<HoliHtmlViewProps> = ({ source, style, testID }) => {
  const defaultStyles = { borderStyle: 'solid', borderWidth: 0, overflow: 'auto' }

  if (!source) return null

  return (
    <View style={[defaultStyles, style]} testID={testID}>
      <div dangerouslySetInnerHTML={{ __html: source }} className="html-view" />
    </View>
  )
}

export default HoliHtmlView
