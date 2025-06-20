import React, { useRef } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import type { WebView } from 'react-native-webview'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useTheme } from '@holi/ui/styles/theme'

const MarketingCampaign = () => {
  const { theme } = useTheme()
  const webViewRef = useRef<WebView>(null)
  const uri = 'https://holi.social/gute-taten' //TODO: This is a temporary URL for the marketing campaign, we need to change it to the actual URL once we have the marketing campaign page

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
