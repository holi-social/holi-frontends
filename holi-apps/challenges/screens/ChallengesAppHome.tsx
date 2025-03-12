import { Camera } from 'expo-camera'
import React, { useEffect, useRef, useState } from 'react'
import { Linking, Platform, Share } from 'react-native'
import type { WebView, WebViewMessageEvent } from 'react-native-webview'

import { useNavigation } from '@react-navigation/native'

import { holiNextJSApiUrl } from '@holi/api/config'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useErrorHandling } from '@holi/core/errors/hooks'
import createParamHooks from '@holi/core/navigation/hooks/useParam/createParamHooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'

import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'

import { createExternalChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'
import type { ChallengesAppHomeParams } from '@holi-apps/challenges/screens/ChallengesAppHome.shared'
import NotificationSettingsPrompt from '@holi-apps/challenges/screens/NotificationSettingsPrompt'

const { useParam } = createParamHooks<ChallengesAppHomeParams>()

const ChallengesAppHome = () => {
  const { theme } = useTheme()
  const { navigate } = useRouting()
  const [pathQueryParam] = useParam('path')
  const { goBack } = useNavigation()
  const { displayError } = useErrorHandling()
  const [showOptInModal, setShowOptInModal] = useState(false)

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
        title: 'Holi Challenge',
        message: Platform.OS === 'android' ? url : message,
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
      case 'video-submitted':
        setTimeout(() => setShowOptInModal(true), 3000)
        break
      case 'open-settings':
        Linking.openSettings()
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
    <>
      <NotificationSettingsPrompt prompt={showOptInModal} onPromptChanged={setShowOptInModal} />
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
    </>
  )
}

export default ChallengesAppHome
