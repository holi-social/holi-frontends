import React from 'react'
import { useTranslation } from 'react-i18next'

import { useChatInitialized } from '@holi/chat/src/client/chatSession'
import { getOrCreateRoom } from '@holi/chat/src/store'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import { chatServerName } from '@holi/core/helpers/config'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import { User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export function StartChatButton({
  label,
  doReplaceRoute,
  user,
  ...rest
}: {
  user: User | null
  label: string
  doReplaceRoute?: boolean
}) {
  const { t } = useTranslation()
  const { ftLoading, ftEnabled } = useFeatureToggle(FeatureToggleName.CHAT)
  const isChatInitialized = useChatInitialized()

  const { isLoggedIn } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()

  const { openToast } = useToast()
  const { replaceRoute, navigate } = useRouting()

  const identity = user?.identity

  const handleChat = async () => {
    if (!isLoggedIn) return openLoginModal()

    if (!identity) {
      logError(new HoliError('Can not create a chat without a user identity'), 'Failed to open chat', {
        location: 'StartChatButton.handleChat',
      })
      return
    }

    try {
      // TODO: the correct Matrix identity should come from Okuna
      const fullIdentity = '@' + identity + ':' + chatServerName
      const { room_id } = await getOrCreateRoom([fullIdentity])

      if (!room_id) {
        openToast(t('global.offline.description'), HoliToastType.SUCCESS)
        return
      }
      if (doReplaceRoute) {
        await replaceRoute('/chat/rooms/' + room_id)
      } else {
        navigate('/chat/rooms/' + room_id)
      }
    } catch (e) {
      openToast(t('global.offline.description'), HoliToastType.SUCCESS)
    }
  }

  return (
    <HoliButtonLoading
      disabled={ftLoading || !ftEnabled || !isChatInitialized || !identity}
      label={label}
      onPress={handleChat}
      testID="user-profile-open-chat"
      {...rest}
    >
      {label}
    </HoliButtonLoading>
  )
}
