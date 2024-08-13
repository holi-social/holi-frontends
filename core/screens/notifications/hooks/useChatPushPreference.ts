import { useCallback, useEffect, useState } from 'react'

import { useChatInitialized } from '@holi/chat/src/client/chatState'
import { getChatClient } from '@holi/chat/src/store'
import { logError } from '@holi/core/errors/helpers'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'

export const useChatPushPreference = () => {
  const [chatPushEnabled, setChatPushEnabled] = useState<boolean>()
  const [loadingChatPushPreference, setLoadingChatPushPreference] = useState(true)
  const chatFeatureFlag = useFeatureFlagWithMaintenance(FeatureFlagKey.CHAT)
  const chatInitialized = useChatInitialized()

  useEffect(() => {
    if (chatFeatureFlag.isOn && chatInitialized) {
      getChatClient()
        .getPushNotificationEnabledState()
        .then(setChatPushEnabled)
        .catch((error) =>
          logError(error, 'Error while fetching chat push notification preferences', {
            location: 'useChatPushPreferences.getPushNotificationEnabledState',
          })
        )
        .finally(() => setLoadingChatPushPreference(false))
    }
  }, [chatFeatureFlag.isOn, chatInitialized])

  const updateChatPushPreference = useCallback(
    async (enabled: boolean) => {
      if (!chatFeatureFlag.isOn) {
        return
      }
      return getChatClient()
        .setPushNotificationsEnabled(enabled)
        .then(() => setChatPushEnabled(enabled))
        .catch((error) =>
          logError(error, 'Error while updating chat push notification preferences', {
            location: 'useChatPushPreferences.updateChatPreferences',
          })
        )
    },
    [chatFeatureFlag.isOn]
  )

  return {
    chatEnabled: chatFeatureFlag.isOn,
    chatPushEnabled,
    updateChatPushPreference,
    loadingChatPushPreference: chatFeatureFlag.isOn && (!chatInitialized || loadingChatPushPreference),
  }
}
