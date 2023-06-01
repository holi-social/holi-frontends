import { useQuery } from '@apollo/client'
import Constants from 'expo-constants'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState, AppStateStatus, BackHandler, Linking, Platform } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { CheckAppVersionResponse, NeedUpdateType, checkAppVersionQuery } from '@holi/core/screens/homeFeed/queries'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

const UpdateAppModal = () => {
  const { t } = useTranslation()
  const { error, data, refetch } = useQuery<CheckAppVersionResponse>(checkAppVersionQuery, {
    variables: { version: Constants.manifest?.version },
  })
  const [showModal, setShowModal] = useState(false)

  const updateApp = () => {
    const androidPackageName = Constants.manifest?.android?.package
    switch (Platform.OS) {
      case 'ios':
        Linking.openURL(data?.checkAppVersion?.appStoreUrl ?? 'itms-apps://apps.apple.com/id6446693757').catch(
          (error) => {
            logError(error, `[UpdateAppModal.tsx] ${error.message}`)
          }
        )
        break
      case 'android':
        Linking.openURL(data?.checkAppVersion?.playStoreUrl ?? `market://details?id=${androidPackageName}`).catch(
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

    if (data?.checkAppVersion?.needUpdate === NeedUpdateType.FORCED) {
      setShowModal(true)
    } else if (data?.checkAppVersion?.needUpdate === NeedUpdateType.SUGGESTED) {
      // TODO: Manage the suggested update case
      setShowModal(false)
    } else {
      setShowModal(false)
    }
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

export default UpdateAppModal
