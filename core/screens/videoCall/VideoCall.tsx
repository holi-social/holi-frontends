import { withProfiler } from '@sentry/react'
import { Camera } from 'expo-camera'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, useWindowDimensions } from 'react-native'

import { holiApiGateway } from '@holi/api/config'
import { createAuthorizationHeaders } from '@holi/api/helpers'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import HoliWebView from '@holi/core/components/HoliWebView'
import { logError } from '@holi/core/errors/helpers'
import { jitsiUrl } from '@holi/core/helpers/config'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import type { VideoCallParams } from '@holi/core/screens/videoCall/VideoCall.shared'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'

const { useParam } = createParamHooks<VideoCallParams>()

const VideoCall: React.FC = () => {
  const [roomName] = useParam('roomName')
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const setScreenOptions = useSetScreenOptions()
  const [webViewUrl, setWebViewUrl] = useState('')
  const { theme } = useTheme()

  const fallbackUrl = jitsiUrl + '/' + roomName
  const videoCallApiUrl = holiApiGateway + '/api/video-call/' + roomName

  useIsomorphicLayoutEffect(() => {
    if (roomName) {
      setScreenOptions({
        headerTitle: () => (
          <HoliHeading level="1" size="s" numberOfLines={1}>
            {t('videocall.webview.heading', { roomName })}
          </HoliHeading>
        ),
      })
    }
  }, [roomName, setScreenOptions, t])

  const requestPermissions = useCallback(() => {
    if (Platform.OS !== 'web') {
      Camera.requestCameraPermissionsAsync().then((response) => {
        if (response.granted) Camera.requestMicrophonePermissionsAsync()
      })
    }
  }, [])

  useEffect(requestPermissions, [requestPermissions])

  useEffect(() => {
    if (roomName) {
      createAuthorizationHeaders()
        .then((headers) =>
          fetch(videoCallApiUrl, { headers: new Headers(headers) })
            .then((res) => {
              setWebViewUrl(res.url)
            })
            .catch((error) => {
              logError(error, 'Error fetching video call api', {
                location: 'VideoCall.createAuthorizationHeaders',
              })
              setWebViewUrl(fallbackUrl)
            })
        )
        .catch((error) => {
          logError(error, 'Error creating authorization headers', {
            location: 'VideoCall.createAuthorizationHeaders',
          })
          setWebViewUrl(fallbackUrl)
        })
    }
  }, [fallbackUrl, roomName, videoCallApiUrl])

  if (!roomName || !webViewUrl) {
    return <HoliLoader />
  }

  // Webview props for video call in webview, found on https://docs.whereby.com/embedding-rooms/in-a-mobile-app/in-react-native via https://github.com/react-native-webview/react-native-webview/issues/508
  const webViewProps = {
    source: { uri: webViewUrl },
    mediaPlaybackRequiresUserAction: false,
    allowsInlineMediaPlayback: true,
    javaScriptEnabled: true,
    domStorageEnabled: true,
    // Overriding the user agent for iOS webview, otherwise jitsi won't support it
    userAgent: Platform.OS === 'ios' ? 'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0' : undefined,
  }
  return (
    <DefaultLayout hasFooterTabBar={false}>
      <HoliWebView style={styles.webView} webViewProps={webViewProps} theme={theme} />
    </DefaultLayout>
  )
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    webView: {
      ...Platform.select({
        android: {
          marginTop: dimensions.topBarHeight,
          minHeight: deviceHeight - dimensions.topBarHeight,
        },
        ios: {
          marginTop: 12,
          minHeight: deviceHeight - dimensions.topBarHeight - dimensions.bottomBarHeight * 1.5,
        },
      }),
    },
  })

export default withProfiler(VideoCall, { name: 'VideoCall' })
