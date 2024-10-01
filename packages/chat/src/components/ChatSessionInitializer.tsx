import React, { type PropsWithChildren, memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { startChat } from '@holi/chat/src/client/chatSession'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { useDeviceToken } from '@holi/core/screens/notifications/helpers/useDeviceToken'

const ChatSessionInitializer = ({ children }: PropsWithChildren) => {
  const { user } = useLoggedInUser()
  const { deviceToken, deviceTokenInitialized } = useDeviceToken()
  const { t } = useTranslation()

  const identity = user?.identity
  const { displayError } = useErrorHandling()
  const chatFeatureFlag = useFeatureFlagWithMaintenance(FeatureFlagKey.CHAT)

  useEffect(() => {
    if (chatFeatureFlag.isOn) {
      if (identity && deviceTokenInitialized) {
        startChat(t, deviceToken).catch((error) =>
          displayError(error, 'Failed to start chat', {
            location: 'ChatSessionInitializer.startChat',
          })
        )
      }
    }
  }, [displayError, identity, chatFeatureFlag.isOn, deviceTokenInitialized, deviceToken, t])

  return <>{children}</>
}

export default memo(ChatSessionInitializer)
