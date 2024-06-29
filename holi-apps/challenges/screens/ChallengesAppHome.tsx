import { Camera } from 'expo-camera'
import React, { useEffect, useRef, useState } from 'react'
import { WebView, WebViewMessageEvent } from 'react-native-webview'

import { useNavigation } from '@react-navigation/native'

import HoliWebView from '@holi/core/components/HoliWebView'
import createParamHooks from '@holi/core/navigation/hooks/useParam/createParamHooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'

import { createExternalChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'
import { ChallengesAppHomeParams } from '@holi-apps/challenges/screens/ChallengesAppHome.shared'

const { useParam } = createParamHooks<ChallengesAppHomeParams>()

const ChallengesAppHome = () => {
  const { theme } = useTheme()
  const { navigate } = useRouting()
  const [pathQueryParam] = useParam('path')
  const { goBack } = useNavigation()

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

  const handleMessageFromBackend = async (event: WebViewMessageEvent) => {
    switch (event.nativeEvent.data) {
      case 'requestPermission':
        await requestPermissions().then((granted) => {
          if (granted) {
            webViewRef.current?.postMessage('requestPermissionGranted')
          } else {
            webViewRef.current?.postMessage('requestPermissionDenied')
          }
        })
        break
      case 'register':
        navigate('/onboarding')
        break
      case 'login':
        navigate('/login')
        break
      case 'exit':
        goBack()
        break
    }
  }

  useEffect(() => {
    isCameraAndMicPermissionGranted().then((permission) => setRequireCameraPermission(!permission))
  }, [])

  if (!headers || requireCameraPermission === undefined) {
    return <HoliLoader />
  }

  const uri = createExternalChallengesPath(pathQueryParam)

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
