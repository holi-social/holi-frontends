import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState, AppStateStatus, BackHandler, Linking, Platform } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { CheckAppVersionResponse, NeedUpdateType, checkAppVersionQuery } from '@holi/core/screens/homeFeed/queries'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

const UpdateAppModal = () => {
  const { t } = useTranslation()
  const ANDROID_PACKAGE_NAME = Constants.manifest?.android?.package
  const BUILD_NUMBER =
    Platform.OS === 'ios'
      ? Constants.manifest?.ios?.buildNumber
      : Platform.OS === 'android'
      ? Constants.manifest?.android?.versionCode?.toString()
      : null

  const { error, data, refetch } = useQuery<CheckAppVersionResponse>(checkAppVersionQuery, {
    variables: { version: Constants.manifest?.version, buildNumber: BUILD_NUMBER },
  })
  const [showModal, setShowModal] = useState(false)

  const updateApp = () => {
    switch (Platform.OS) {
      case 'ios':
        Linking.openURL(data?.checkAppVersion?.appStoreUrl ?? 'itms-apps://apps.apple.com/id6446693757').catch(
          (error) => {
            logError(error, `[UpdateAppModal.tsx] ${error.message}`)
          }
        )
        break
      case 'android':
        Linking.openURL(data?.checkAppVersion?.playStoreUrl ?? `market://details?id=${ANDROID_PACKAGE_NAME}`).catch(
          (error) => {
            logError(error, `[UpdateAppModal.tsx] ${error.message}`)
          }
        )
        break
      default:
        break
    }
  }

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refetch()

        // we don't have a badge count concept yet,
        // so we just clear anything that is there
        // when the app comes in foreground
        // doing it here, because UpdateAppModal always mounted
        // and only used on mobile
        Notifications.setBadgeCountAsync(0)
      }
    }
    const appStateListener = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      appStateListener.remove()
    }
  }, [refetch])

  useEffect(() => {
    if (error) {
      logError(error, `[UpdateAppModal.tsx] ${error.message}`)
      return
    }

    if (data?.checkAppVersion?.needUpdate === NeedUpdateType.MANDATORY) {
      setShowModal(true)
      return
    }
    setShowModal(false)
  }, [data, error, showModal])

  return (
    <HoliConfirmation
      show={showModal}
      label={t('update.modal.title')}
      title={t('update.modal.title')}
      description={t('update.modal.description')}
      dismissText={t('update.modal.dialog.dismiss')}
      confirmText={t('update.modal.dialog.confirm')}
      testID="update-app-confirmation"
      onDismiss={
        Platform.OS === 'android'
          ? () => {
              BackHandler.exitApp()
            }
          : undefined
      }
      onConfirm={() => {
        updateApp()
      }}
    />
  )
}

export default withProfiler(UpdateAppModal, { name: 'UpdateAppModal' })
