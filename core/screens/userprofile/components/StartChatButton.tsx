import React from 'react'
import { useTranslation } from 'react-i18next'

import { useChatInitialized } from '@holi/chat/src/client/chatState'
import { getOrCreatePrivateRoom } from '@holi/chat/src/store'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import type { User } from '@holi/core/domain/shared/types'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { chatServerName } from '@holi/core/helpers/config'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { Button, type ButtonProps } from 'holi-bricks/components/button'

export function StartChatButton({
  label,
  doReplaceRoute,
  user,
  ...rest
}: {
  user: User | null
  label: string
  doReplaceRoute?: boolean
} & ButtonProps) {
  const { t } = useTranslation()
  const chatFeatureFlag = useFeatureFlagWithMaintenance(FeatureFlagKey.CHAT)
  const isChatInitialized = useChatInitialized()

  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()

  const { openToast } = useToast()
  const { replaceRoute, navigate } = useRouting()

  const identity = user?.identity

  const handleChat = async () => {
    if (!isLoggedIn) {
      return openSignupModal({
        description: t('chat.start.loginRedirect.text'),
        trackTrigger: 'START_CHAT',
      })
    }

    if (!identity) {
      logError(new HoliError('Can not create a chat without a user identity'), 'Failed to open chat', {
        location: 'StartChatButton.handleChat',
      })
      return
    }

    try {
      // TODO: the correct Matrix identity should come from Okuna
      const fullIdentity = '@' + identity + ':' + chatServerName
      const { room_id } = await getOrCreatePrivateRoom([fullIdentity])

      if (!room_id) {
        openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
        return
      }
      if (doReplaceRoute) {
        await replaceRoute('/chat/rooms/' + room_id)
      } else {
        navigate('/chat/rooms/' + room_id)
      }
    } catch (e) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
      openToast(t('chat.room.error.openRoom'), HoliToastType.ERROR)
    }
  }

  return (
    <Button
      disabled={!chatFeatureFlag.isOn || !isChatInitialized || !identity}
      label={label}
      onPress={handleChat}
      testID="user-profile-open-chat"
      {...rest}
    />
  )
}
