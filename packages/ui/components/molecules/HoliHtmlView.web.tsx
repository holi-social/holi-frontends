import React, { useEffect, useRef } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

export type htmlString = string

export type HoliHtmlViewProps = {
  source: htmlString
  height: ViewStyle['height']
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView: React.VFC<HoliHtmlViewProps> = ({ source, height, style, testID }) => {
  const viewRef = useRef<View>(null)

  useEffect(() => {
    // https://stackoverflow.com/questions/23616226/insert-html-with-react-variable-statements-jsx
    if (viewRef && viewRef.current) {
      viewRef.current.innerHTML = source
    }
  }, [viewRef, source])

  return <View ref={viewRef} style={[style, { height: height, overflow: 'scroll' }]} testID={testID} />
}

export default HoliHtmlView
