import React, { useRef } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import type { WebView } from 'react-native-webview'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useTheme } from '@holi/ui/styles/theme'

const MarketingCampaign = () => {
  const { theme } = useTheme()
  const webViewRef = useRef(null as unknown as WebView)
  const uri = 'https://holi.social/1million'

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <HoliWebView
        webViewRef={webViewRef}
        allowsBackForwardNavigationGesturesMultiOS={true}
        webViewProps={{
          setSupportMultipleWindows: false,
          allowsBackForwardNavigationGestures: true,
          source: {
            uri,
          },
        }}
        theme={theme}
      />
    </KeyboardAvoidingView>
  )
}

export default MarketingCampaign
