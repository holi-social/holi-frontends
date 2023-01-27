import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'

export type importRef = string

export type HoliHtmlViewProps = {
  source: importRef
  height: ViewStyle['height']
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView: React.VFC<HoliHtmlViewProps> = ({ source, height, style, testID }) => {
  {
    /* https://npmtrends.com/react-native-htmlview-vs-react-native-render-html-vs-react-native-webview */
  }
  return (
    <WebView
      style={[style, { height: height, marginTop: 0, paddingTop: 0, flex: 1 }]}
      testID={testID}
      containerStyle={{ flex: 1, marginTop: 50, padding: 30 }}
      originWhitelist={['*']}
      // source={{ html: htmlString }}
      // source={{ uri: 'https://holi.atlassian.net/wiki/plugins/viewstorage/viewpagestorage.action?pageId=261259295' }}
      source={source}
      scalesPageToFit={false}
      textZoom={100}
    />
  )
}

export default HoliHtmlView
