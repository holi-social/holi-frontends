import { Camera } from 'expo-camera'
import Constants from 'expo-constants'
import React, { useEffect, useRef, useState } from 'react'
import { WebView, WebViewMessageEvent } from 'react-native-webview'

import { useNavigation } from '@react-navigation/native'

import { AuthorizationHeaders, createAuthorizationHeaders } from '@holi/api/helpers'
import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import HoliWebView from '@holi/core/components/HoliWebView'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import createParamHooks from '@holi/core/navigation/hooks/useParam/createParamHooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent } from '@holi/core/tracking/types'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'

import { challengeAppBaseUrl } from '@holi-apps/challenges/config'
import { ChallengesAppHomeParams } from '@holi-apps/challenges/screens/ChallengesAppHome.shared'

const { useParam } = createParamHooks<ChallengesAppHomeParams>()

export const ChallengesAppHome = () => {
  const useConsent = useConsentState()
  const { theme } = useTheme()
  const { navigate } = useRouting()
  const [pathQueryParam] = useParam('path')
  const { goBack } = useNavigation()

  const [authHeaders, setAuthHeaders] = useState<AuthorizationHeaders | undefined>(undefined)
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
        // share link
        break
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      setRequireCameraPermission(!(await isCameraAndMicPermissionGranted()))
      setAuthHeaders(await createAuthorizationHeaders())
    })()
  }, [])

  if (authHeaders === undefined || isCameraAndMicPermissionGranted === undefined) {
    return <HoliLoader />
  }

  let uri = challengeAppBaseUrl
  if (pathQueryParam) {
    uri += decodeURIComponent(pathQueryParam)
  }

  return (
    <FeatureToggleGuard toggleName={FeatureToggleName.CHALLENGES} featureNameKey="challenges:maintenance.feature">
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
              ...authHeaders,
              'X-Client-Platform': 'holi',
              'X-Client-Platform-Version': Constants.expoConfig?.version,
              'X-Client-Platform-Feature-Flags':
                'no-back-app-header, umuted-video-start, versioned-message-from-backend',
              'X-Require-Camera-Permission': `${requireCameraPermission}`,
              'X-Client-Platform-User-Consent': `${useConsent.ANALYTICS === Consent.Given}`,
            },
          },
        }}
        theme={theme}
      />
    </FeatureToggleGuard>
  )
}
