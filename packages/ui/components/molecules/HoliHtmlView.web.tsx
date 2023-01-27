import React, { useEffect, useRef } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'

// import TheStyles from '@holi/web/styles/globals.scss'

export type HoliHtmlViewProps = {
  htmlString: string
  height: ViewStyle['height']
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView: React.VFC<HoliHtmlViewProps> = ({ htmlString, height, style, testID }) => {
  // const myHtml = require('@holi/core/static/codeOfConduct_en.html')
  const html = '<style>p {color: pink; }</style><p>Hello World!</p>'

  const viewRef = useRef<View>(null)

  useEffect(() => {
    // https://stackoverflow.com/questions/23616226/insert-html-with-react-variable-statements-jsx
    if (viewRef && viewRef.current) {
      viewRef.current.innerHTML = html
    }
  }, [viewRef])

  return (
    <View style={[style, { height: height }]} testID={testID}>
      <HoliText>{htmlString}</HoliText>
      <View ref={viewRef} />
    </View>
  )
}

export default HoliHtmlView
