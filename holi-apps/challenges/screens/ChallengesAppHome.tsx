import { Camera } from 'expo-camera'
import * as Notifications from 'expo-notifications'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, Share } from 'react-native'
import type { WebView, WebViewMessageEvent } from 'react-native-webview'

import { useNavigation } from '@react-navigation/native'

import { holiNextJSApiUrl } from '@holi/api/config'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useErrorHandling } from '@holi/core/errors/hooks'
import createParamHooks from '@holi/core/navigation/hooks/useParam/createParamHooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import NotificationOptInModal from '@holi/core/screens/notifications/components/NotificationOptInModal'
import {
  dismissNotificationModal,
  incrementModalAttempts,
  useNotificationEligibility,
} from '@holi/core/screens/notifications/helpers/notificationModalHelper/notificationModalHelper'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'

import { createExternalChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'
import type { ChallengesAppHomeParams } from '@holi-apps/challenges/screens/ChallengesAppHome.shared'

const { useParam } = createParamHooks<ChallengesAppHomeParams>()

const ChallengesAppHome = () => {
  const { theme } = useTheme()
  const { navigate } = useRouting()
  const pathQueryParam = useParam('path')
  const { goBack } = useNavigation()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const headers = useChallengesHeaders()
  const [requireCameraPermission, setRequireCameraPermission] = useState<boolean | undefined>(undefined)
  const webViewRef = useRef<WebView>(null)

  const { isEligible } = useNotificationEligibility()
  const [modalVisible, setModalVisible] = useState(false)

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
        setTimeout(() => showOptInModal(), 3000)
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

  const showOptInModal = async () => {
    const { status } = await Notifications.getPermissionsAsync()
    const shouldShowModal = status !== 'granted' && isEligible

    if (shouldShowModal) {
      setModalVisible(true)
    }
  }

  const openSettings = async () => {
    try {
      await Linking.openURL('app-settings:')
    } catch (error) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
      //Failed to open settings
    }
  }

  const handleOptIn = async () => {
    const { status } = await Notifications.getPermissionsAsync()

    await incrementModalAttempts()

    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync()

      if (newStatus === 'granted') {
        setModalVisible(false)
      } else if (newStatus === 'undetermined') {
        // Do nothing, keep the modal open
      } else {
        openSettings()
        setModalVisible(false)
      }
    } else {
      setModalVisible(false)
    }
  }

  const handleModalDismiss = async () => {
    await incrementModalAttempts()
    setModalVisible(false)
  }

  const handleDismissNotification = async () => {
    await dismissNotificationModal()
    setModalVisible(false)
  }

  return (
    <>
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
      {Platform.OS !== 'web' && (
        <NotificationOptInModal
          type="challenges"
          isVisible={modalVisible}
          onConfirm={handleOptIn}
          onDismiss={handleModalDismiss}
          dismissModal={handleDismissNotification}
          description={t('notifications.permission.description.challenges')}
        />
      )}
    </>
  )
}

export default ChallengesAppHome
