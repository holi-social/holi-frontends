import React, { useEffect, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import '@holi/core/static/stylesWeb.scss'

export type htmlString = string

export type HoliHtmlViewProps = {
  source: htmlString
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView: React.VFC<HoliHtmlViewProps> = ({ source, style, testID }) => {
  const viewRef = useRef<View>(null)

  useEffect(() => {
    // https://stackoverflow.com/questions/23616226/insert-html-with-react-variable-statements-jsx
    if (viewRef && viewRef.current) {
      viewRef.current.className = 'html-view'
      viewRef.current.innerHTML = source
    }
  }, [viewRef, source])

  return <View ref={viewRef} style={[styles.defaults, style]} testID={testID} />
}

export default HoliHtmlView

const styles = StyleSheet.create({
  defaults: {
    borderStyle: 'solid',
  },
})
