import { useCallback, useEffect, useState } from 'react'

import { useChatInitialized } from '@holi/chat/src/client/chatState'
import { getChatClient } from '@holi/chat/src/store'
import { logError } from '@holi/core/errors/helpers'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'

export const useChatPushPreference = () => {
  const [chatPushEnabled, setChatPushEnabled] = useState<boolean>()
  const [loadingChatPushPreference, setLoadingChatPushPreference] = useState(true)
  const { ftLoading, ftEnabled } = useFeatureToggle(FeatureToggleName.CHAT)
  const chatInitialized = useChatInitialized()

  useEffect(() => {
    if (!ftLoading && ftEnabled && chatInitialized) {
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
  }, [ftEnabled, ftLoading, chatInitialized])

  const updateChatPushPreference = useCallback(
    async (enabled: boolean) => {
      if (!ftEnabled) {
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
    [ftEnabled]
  )

  return {
    chatEnabled: ftEnabled,
    chatPushEnabled,
    updateChatPushPreference,
    loadingChatPushPreference: ftLoading || (ftEnabled && (!chatInitialized || loadingChatPushPreference)),
  }
}
