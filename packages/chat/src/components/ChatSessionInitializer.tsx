import React, { type PropsWithChildren, memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { startChat } from '@holi/chat/src/client/chatSession'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { useDeviceToken } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

const ChatSessionInitializer = ({ children }: PropsWithChildren) => {
  const { user } = useLoggedInUser()
  const { deviceToken, deviceTokenInitialized } = useDeviceToken()
  const { t } = useTranslation()

  const identity = user?.identity
  const { displayError } = useErrorHandling()
  const { ftLoading, ftEnabled } = useFeatureToggle(FeatureToggleName.CHAT)

  useEffect(() => {
    if (!ftLoading && ftEnabled) {
      if (identity && deviceTokenInitialized) {
        startChat(t, deviceToken).catch((error) =>
          displayError(error, 'Failed to start chat', {
            location: 'ChatSessionInitializer.startChat',
          })
        )
      }
    }
  }, [displayError, identity, ftLoading, ftEnabled, deviceTokenInitialized, deviceToken, t])

  return <>{children}</>
}

export default memo(ChatSessionInitializer)
