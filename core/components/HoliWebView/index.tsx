import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { ShouldStartLoadRequest, WebViewSource, WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes'

import { useNavigation } from '@react-navigation/native'

import { mobileWebviewHeader } from '@holi/core/auth/helpers/oauth2'
import { HoliWebViewProps } from '@holi/core/components/HoliWebView/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme } from '@holi/ui/styles/theme'

const isWebViewSourceUri = (value: WebViewSource | undefined): value is WebViewSourceUri => {
  return !!value && 'uri' in value
}

const addHeadersIfSourceUri = (
  value: WebViewSource | undefined,
  uri: string | undefined
): WebViewSource | undefined => {
  if (!isWebViewSourceUri(value) || !uri) {
    return value
  }
  return {
    ...value,
    uri,
    headers: {
      ...value.headers,
      [mobileWebviewHeader]: 'true',
    },
  } as WebViewSourceUri
}

const HoliWebView: React.FC<HoliWebViewProps> = ({ style, webViewProps, theme, navigateToExternalBrowser = false }) => {
  const webViewRef = useRef<WebView>(null)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const navigation = useNavigation()
  const [currentUri, setCurrentUri] = useState(
    isWebViewSourceUri(webViewProps?.source) ? webViewProps.source?.uri : undefined
  )

  const styles = useMemo(() => getStyles(theme), [theme])

  const errormessage = t('webview.error')

  const handleError = useCallback(
    (method: string) => (error: unknown) => {
      displayError(error, 'Failed to load page in webview', {
        displayMessage: errormessage,
        location: 'HoliWebView.handleError',
        method,
      })
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

  const onShouldStartLoadWithRequest = useCallback(
    (request: ShouldStartLoadRequest): boolean => {
      // type-correct way of checking whether we are not initially loading the page, but reacting on a tap on a link
      if (
        navigateToExternalBrowser &&
        isWebViewSourceUri(webViewProps.source) &&
        request.url !== webViewProps.source.uri
      ) {
        // open in external browser
        Linking.openURL(request.url)
        // don't follow the link in webview itself
        return false
      } else {
        // Force rerender to pass custom header, see
        // https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#working-with-custom-headers-sessions-and-cookies
        if (request.url === currentUri) {
          return true
        }
        setCurrentUri(request.url)
        // FIXME: Open issue for ios: onShouldStartLoadWithRequest not called after redirect, see https://github.com/react-native-webview/react-native-webview/issues/3153
        return Platform.OS !== 'android'
      }
    },
    [currentUri, navigateToExternalBrowser, webViewProps.source]
  )

  return (
    <WebView
      ref={webViewRef}
      style={style}
      onError={handleError('onError')}
      onHttpError={handleError('onHttpError')}
      onRenderProcessGone={handleError('onRenderProcessGone')}
      startInLoadingState={true}
      renderLoading={() => <HoliLoader style={styles.loaderContainer} />}
      renderError={renderError}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      {...webViewProps}
      source={addHeadersIfSourceUri(webViewProps.source, currentUri)}
      testID="web-view"
    />
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    loaderContainer: {
      backgroundColor: theme.colors.background10,
    },
    messageContainer: {
      alignItems: 'center',
      position: 'absolute',
      paddingTop: dimensions.topBarHeight + 50,
      backgroundColor: theme.colors.background10,
      width: '100%',
      height: '100%',
    },
  })

export default HoliWebView
