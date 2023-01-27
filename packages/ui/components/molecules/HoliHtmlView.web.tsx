import React, { useEffect, useRef } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import theHtml from '@holi/core/static/codeOfConduct_en.html'

export type HoliHtmlViewProps = {
  htmlString: string
  height: ViewStyle['height']
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView: React.VFC<HoliHtmlViewProps> = ({ htmlString, height, style, testID }) => {
  // const html = require('@holi/core/static/codeOfConduct_en.html')
  // const html = '<style>p {color: pink; }</style><p>Hello World!</p>'

  const viewRef = useRef<View>(null)

  console.log(htmlString)

  useEffect(() => {
    // https://stackoverflow.com/questions/23616226/insert-html-with-react-variable-statements-jsx
    if (viewRef && viewRef.current) {
      viewRef.current.innerHTML = theHtml
    }
  }, [viewRef])

  return <View ref={viewRef} style={[style, { height: height, overflow: 'scroll' }]} testID={testID} />
}

export default HoliHtmlView
