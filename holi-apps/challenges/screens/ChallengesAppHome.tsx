import { Camera } from 'expo-camera'
import React, { useEffect, useRef, useState } from 'react'
import { Share } from 'react-native'
import { WebView, WebViewMessageEvent } from 'react-native-webview'

import { useNavigation } from '@react-navigation/native'

import { holiNextJSApiUrl } from '@holi/api/config'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useErrorHandling } from '@holi/core/errors/hooks'
import createParamHooks from '@holi/core/navigation/hooks/useParam/createParamHooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'

import { challengeAppBaseUrl } from '@holi-apps/challenges/config'
import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'
import { ChallengesAppHomeParams } from '@holi-apps/challenges/screens/ChallengesAppHome.shared'

const { useParam } = createParamHooks<ChallengesAppHomeParams>()

const ChallengesAppHome = () => {
  const { theme } = useTheme()
  const { navigate } = useRouting()
  const [pathQueryParam] = useParam('path')
  const { goBack } = useNavigation()
  const { displayError } = useErrorHandling()

  const headers = useChallengesHeaders()
  const [requireCameraPermission, setRequireCameraPermission] = useState<boolean | undefined>(undefined)
  const webViewRef = useRef<WebView>(null)

  const requestPermissions = async () => {
    const cameraPermissionResult = await Camera.requestCameraPermissionsAsync()
    const micPermissionResult = await Camera.requestMicrophonePermissionsAsync()
    return cameraPermissionResult.granted && micPermissionResult.granted
  }

  const isCameraAndMicPermissionGranted = async () => {
    const cameraPermissionResult = await Camera.getCameraPermissionsAsync()
    const micPermissionResult = await Camera.getMicrophonePermissionsAsync()
    return cameraPermissionResult.granted && micPermissionResult.granted
  }

  const share = async (message: string, path: string) => {
    const url = `${holiNextJSApiUrl}/de/apps/challenges?path=${encodeURIComponent(path)}`
    try {
      await Share.share({
        title: 'Holi Challenges',
        message: message,
        url: url,
      })
    } catch (error) {
      displayError(error, 'Failed to share link', {
        location: 'useShareLink.shareLinkMobile',
      })
      throw error
    }
  }

  const handleMessageFromBackend = async (event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data)
    switch (message.name) {
      case 'request-permission':
        await requestPermissions().then((granted) => {
          if (granted) {
            webViewRef.current?.postMessage('requestPermissionGranted')
          } else {
            webViewRef.current?.postMessage('requestPermissionDenied')
          }
        })
        break
      case 'navigate-path':
        navigate(message.path)
        break
      case 'navigate-exit':
        goBack()
        break
      case 'share':
        await share(message.message, message.path)
        break
    }
  }

  useEffect(() => {
    isCameraAndMicPermissionGranted().then((permission) => setRequireCameraPermission(!permission))
  }, [])

  if (!headers || isCameraAndMicPermissionGranted === undefined) {
    return <HoliLoader />
  }

  let uri = challengeAppBaseUrl
  if (pathQueryParam) {
    uri += decodeURIComponent(pathQueryParam)
  }

  return (
    <HoliWebView
      webViewRef={webViewRef}
      allowsBackForwardNavigationGesturesMultiOS={true}
      webViewProps={{
        setSupportMultipleWindows: false,
        allowsBackForwardNavigationGestures: true,
        allowsInlineMediaPlayback: true,
        mediaCapturePermissionGrantType: 'grant',
        sharedCookiesEnabled: true,
        onMessage: handleMessageFromBackend,
        source: {
          uri,
          headers: {
            ...headers,
            'X-Require-Camera-Permission': `${requireCameraPermission}`,
          },
        },
      }}
      theme={theme}
    />
  )
}

export default ChallengesAppHome
