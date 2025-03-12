import React, { useEffect, useState } from 'react'
import { Linking } from 'react-native'
import * as Notifications from 'expo-notifications'
import { useTranslation } from 'react-i18next'

import NotificationOptInModal from '@holi/core/screens/notifications/components/NotificationOptInModal'
import {
  dismissNotificationModal,
  incrementModalAttempts,
  useNotificationEligibility,
} from '@holi/core/screens/notifications/helpers/notificationModalHelper/notificationModalHelper'

type NotificationSettingsPromptProps = {
  prompt: boolean
  onPromptChanged: (show: boolean) => void
}

const NotificationSettingsPrompt = async ({ prompt, onPromptChanged }: NotificationSettingsPromptProps) => {
  const { isEligible } = useNotificationEligibility()
  const [modalVisible, setModalVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const checkShouldShowModal = async () => {
      if (prompt) {
        const { status } = await Notifications.getPermissionsAsync()
        const shouldShowModal = status !== 'granted' && isEligible
        setModalVisible(shouldShowModal)
      } else {
        setModalVisible(false)
      }
    }

    checkShouldShowModal()
  }, [prompt, isEligible])

  const openSettings = async () => {
    try {
      await Linking.openURL('app-settings:')
    } catch (error) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
      //Failed to open settings
    }
  }

  const handleModalDismiss = async () => {
    await incrementModalAttempts()
    onPromptChanged(false)
  }

  const handleDismissNotification = async () => {
    await dismissNotificationModal()
    onPromptChanged(false)
  }

  const handleOptIn = async () => {
    const { status } = await Notifications.getPermissionsAsync()

    await incrementModalAttempts()

    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync()

      if (newStatus === 'granted') {
        onPromptChanged(false)
      } else if (newStatus === 'undetermined') {
        // Do nothing, keep the modal open
      } else {
        openSettings()
        onPromptChanged(false)
      }
    } else {
      onPromptChanged(false)
    }
  }

  return (
    <NotificationOptInModal
      type="challenges"
      isVisible={modalVisible}
      onConfirm={handleOptIn}
      onDismiss={handleModalDismiss}
      dismissModal={handleDismissNotification}
      description={t('notifications.permission.description.challenges')}
    />
  )
}

export default NotificationSettingsPrompt
