import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors, vars } from '@holi/ui/styles/globalVars'

export interface HoliWebViewProps {
  uri: string
  style?: StyleProp<ViewStyle>
}

// TODO HOLI-3754: only works on mobile > move to ui package anyways?
const HoliWebView: React.VFC<HoliWebViewProps> = ({ uri, style }) => {
  const [currentURI, setURI] = useState(uri)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { sessionToken } = useAuth()

  const errormessage = t('webview.error')

  const handleError = useCallback(
    (error: unknown) => {
      displayError(error, errormessage)
    },
    [displayError, errormessage]
  )

  const renderError = () => (
    <View style={styles.messageContainer}>
      <HoliText>{errormessage} </HoliText>
    </View>
  )

  // Explicitly handle url changes to make sure cookies are sent on each request
  // Based on https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#setting-custom-headers
  const handleRequest = (request: { url: string }) => {
    if (request.url === currentURI) {
      return true
    }
    const newUrl = request.url.replace('https://staging.web.project-holi.org', 'http://192.168.1.133:3000')
    console.log(newUrl)
    setURI(newUrl)
    return false
  }

  // TODO(SF) necessary?
  // sharedCookiesEnabled
  // TODO(SF) possibly only set when url is matching a certain pattern?
  // const cookie = sessionToken && `X-Session-Token=
  // console.log(cookie)

  const debugging = `
     // Debug
     console = new Object();
     console.log = function(log) {
      window.ReactNativeWebView.postMessage(log);
     };
     console.debug = console.log;
     console.info = console.log;
     console.warn = console.log;
     console.error = console.log;
     `

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMessage = (message: any) => {
    console.log('######### WEBVIEW ########', message?.nativeEvent || message)
  }

  return (
    <WebView
      style={style}
      source={{
        uri: currentURI,
        headers: {
          // Cookie: `ory_kratos_session=${sessionToken}`,
          'X-Session-Token': sessionToken,
          // Cookie: 'cookie1=asdf; cookie2=dfasdfdas',
        },
        // Authorization: `bearer ${sessionToken}`,
      }}
      onError={handleError}
      onHttpError={handleError}
      onRenderProcessGone={handleError}
      onShouldStartLoadWithRequest={handleRequest}
      startInLoadingState={true}
      renderLoading={() => <HoliLoader style={styles.loaderContainer} />}
      renderError={renderError}
      injectedJavaScript={debugging}
      onMessage={onMessage}
      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
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
