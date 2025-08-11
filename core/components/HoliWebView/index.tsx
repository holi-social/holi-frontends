import type React from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Linking, Platform, StyleSheet, View } from 'react-native'
import { WebView, type WebViewNavigation } from 'react-native-webview'
import type { ShouldStartLoadRequest, WebViewSource, WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes'

import { useNavigation } from '@react-navigation/native'

import { mobileWebviewHeader } from '@holi/core/auth/helpers/oauth2'
import type { HoliWebViewProps } from '@holi/core/components/HoliWebView/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'
import type { HoliTheme } from '@holi/ui/styles/theme'

const isWebViewSourceUri = (value: WebViewSource | undefined): value is WebViewSourceUri => {
  return !!value && 'uri' in value
}

const addHeadersAndConvertToHttpsIfSourceUri = (value: WebViewSource | undefined): WebViewSource | undefined => {
  if (!isWebViewSourceUri(value)) {
    return value
  }
  if (value.uri.startsWith('http://')) {
    value.uri = value.uri.replace('http://', 'https://')
  }
  return {
    ...value,
    headers: {
      ...value.headers,
      [mobileWebviewHeader]: 'true',
    },
  } as WebViewSourceUri
}

const HoliWebView: React.FC<HoliWebViewProps> = ({
  style,
  webViewProps,
  theme,
  navigateToExternalBrowser = false,
  allowsBackForwardNavigationGesturesMultiOS = true,
  webViewRef,
}) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const navigation = useNavigation()

  const styles = useMemo(() => getStyles(theme), [theme])

  const injectedThemeJs = `(function(){ let window.localStorage.setItem('theme', ${theme.dark ? 'dark' : 'light'})})();`

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

  let canGoBack = false
  const onNavigationStateChange = (navState: WebViewNavigation) => {
    canGoBack = navState.canGoBack
  }

  const onAndroidBackPress = () => {
    if (webViewRef?.current && canGoBack) {
      webViewRef.current.goBack()
      return true
    }
    return false
  }

  useEffect(() => {
    const webView = webViewRef?.current
    let backHandlerSub: ReturnType<typeof BackHandler.addEventListener> | undefined

    if (Platform.OS === 'android') {
      backHandlerSub = BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress)
    }

    return () => {
      if (Platform.OS === 'android' && backHandlerSub) {
        backHandlerSub.remove()
      }
      navigation.addListener('beforeRemove', () => {
        return webView?.injectJavaScript('window.dispatchEvent( new Event("unload") );')
      })
    }
  })

  const renderError = useCallback(
    () => (
      <View style={styles.messageContainer}>
        <HoliText>{errormessage} </HoliText>
      </View>
    ),
    [styles.messageContainer, errormessage]
  )

  const renderLoading = useCallback(() => <HoliLoader style={styles.loaderContainer} />, [styles.loaderContainer])

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
        return true
      }
    },
    [navigateToExternalBrowser, webViewProps.source]
  )

  return (
    <WebView
      ref={webViewRef}
      style={style}
      onError={handleError('onError')}
      onHttpError={handleError('onHttpError')}
      onRenderProcessGone={handleError('onRenderProcessGone')}
      onNavigationStateChange={onNavigationStateChange}
      startInLoadingState={true}
      renderLoading={renderLoading}
      renderError={renderError}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      allowsBackForwardNavigationGestures={allowsBackForwardNavigationGesturesMultiOS}
      {...webViewProps}
      source={addHeadersAndConvertToHttpsIfSourceUri(webViewProps.source)}
      testID="web-view"
      injectedJavaScript={injectedThemeJs}
      // FIX: This needs setting, for now, in the new React arch. - Fabrik. There's a fix on the way -
      // https://github.com/react-native-webview/react-native-webview/issues/3814
      decelerationRate={0.985}
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
