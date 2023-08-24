import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { ShouldStartLoadRequest, WebViewSourceHtml, WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes'

import { useNavigation } from '@react-navigation/native'

import { HoliWebViewProps } from '@holi/core/components/HoliWebView/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors, vars } from '@holi/ui/styles/globalVars'

const HoliWebView: React.FC<HoliWebViewProps> = ({ style, webViewProps }) => {
  const webViewRef = useRef<WebView>(null)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const navigation = useNavigation()

  const errormessage = t('webview.error')

  const handleError = useCallback(
    (error: unknown) => {
      displayError(error, errormessage)
    },
    [displayError, errormessage]
  )

  useEffect(() => {
    const webView = webViewRef.current
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      return webView?.injectJavaScript('window.dispatchEvent( new Event("unload") );')
    })

    return unsubscribe
  }, [navigation])

  const renderError = () => (
    <View style={styles.messageContainer}>
      <HoliText>{errormessage} </HoliText>
    </View>
  )

  const isWebViewSourceUri = (value: WebViewSourceUri | WebViewSourceHtml | undefined): value is WebViewSourceUri => {
    return !!value && 'uri' in value
  }

  const openInExternalBrowser = (event: ShouldStartLoadRequest): boolean => {
    if (isWebViewSourceUri(webViewProps.source)) {
      // open in external browser
      Linking.openURL(event.url)
    }
    // don't follow the link in webview itself
    return false
  }

  return (
    <WebView
      ref={webViewRef}
      style={style}
      onError={handleError}
      onHttpError={handleError}
      onRenderProcessGone={handleError}
      startInLoadingState={true}
      renderLoading={() => <HoliLoader style={styles.loaderContainer} />}
      renderError={renderError}
      onShouldStartLoadWithRequest={openInExternalBrowser}
      {...webViewProps}
    />
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    backgroundColor: colors.background10,
  },
  messageContainer: {
    alignItems: 'center',
    position: 'absolute',
    paddingTop: vars.topBarHeight + 50,
    backgroundColor: colors.background10,
    width: '100%',
    height: '100%',
  },
})

export default HoliWebView
