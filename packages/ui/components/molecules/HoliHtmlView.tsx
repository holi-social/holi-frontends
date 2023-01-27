import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'

import HoliText from '@holi/ui/components/atoms/HoliText'

// import TheStyles from '@holi/web/styles/globals.scss'

export type HoliHtmlViewProps = {
  htmlString: string
  height: ViewStyle['height']
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliHtmlView: React.VFC<HoliHtmlViewProps> = ({ htmlString, height, style, testID }) => {
  // console.log('###', require('@holi/web/styles/common.css'))

  return (
    <View style={[style, { height: height }]} testID={testID}>
      <HoliText>{htmlString}</HoliText>
      <WebView
        style={{ flex: 1, borderWidth: 1, borderColor: 'blue' }}
        containerStyle={{ marginTop: 20, borderWidth: 1, borderColor: 'red', padding: 30 }}
        originWhitelist={['*']}
        // source={{ html: '<h1>This is a static HTML source!</h1>' }}
        // source={{ uri: 'https://holi.atlassian.net/wiki/plugins/viewstorage/viewpagestorage.action?pageId=261259295' }}
        source={require('@holi/core/static/codeOfConduct_en.html')}
        scalesPageToFit={false}
        textZoom={100}
      />
    </View>
  )
}

export default HoliHtmlView
