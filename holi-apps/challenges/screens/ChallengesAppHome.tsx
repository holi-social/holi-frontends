import { Camera } from 'expo-camera'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { WebView, WebViewMessageEvent } from 'react-native-webview'

import { AuthorizationHeaders, createAuthorizationHeaders } from '@holi/api/helpers'
import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import HoliWebView from '@holi/core/components/HoliWebView'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useRoute } from '@holi/core/navigation/hooks/useParam/useRoute'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'

import { challengeAppBaseUrl } from '@holi-apps/challenges/config'

export const ChallengesAppHome = () => {
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { navigate } = useRouting()
  const route = useRoute()

  const { t } = useTranslation()
  const [authHeaders, setAuthHeaders] = useState<AuthorizationHeaders | undefined>(undefined)
  const [requireCameraPermission, setRequireCameraPermission] = useState<boolean | undefined>(undefined)
  const webViewRef = useRef<WebView>(null)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('challenges:app.name')}
        </HoliHeading>
      ),
      headerLeft: () => <HeaderBackButton tintColor={theme.colors.dark} />,
      headerTransparent: true,
      headerStyle: { backgroundColor: theme.colors.background10 },
      headerTintColor: theme.colors.light,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, theme.colors])

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
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const pathQueryParam = (route?.params as any)?.['path']
  if (typeof pathQueryParam === 'string') {
    uri += decodeURIComponent(pathQueryParam)
  }

  return (
    <FeatureToggleGuard toggleName={FeatureToggleName.CHALLENGES} featureNameKey="challenges:maintenance.feature">
      <HoliWebView
        webViewRef={webViewRef}
        style={styles.container}
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
              'X-Require-Camera-Permission': `${requireCameraPermission}`,
            },
          },
        }}
        theme={theme}
      />
    </FeatureToggleGuard>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 84,
  },
})
