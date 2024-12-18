import { getOrCreateRoom } from '@holi/chat/src/store'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import { chatServerName } from '@holi/core/helpers/config'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const useStartChat = () => {
  const { isLoggedIn } = useLoggedInUser()
  const [isLoading, setIsLoading] = useState(false)
  const { openSignupModal } = useSignupModal()
  const { openToast } = useToast()
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const handleStartChat = async (identity?: string) => {
    setIsLoading(true)
    if (!isLoggedIn) {
      openSignupModal({
        description: t('chat.start.loginRedirect.text'),
        trackTrigger: 'START_CHAT',
      })
      setIsLoading(false)
      return
    }

    if (!identity) {
      logError(new HoliError('Can not create a chat without a user identity'), 'Failed to open chat', {
        location: 'StartChatButton.handleChat',
      })
      setIsLoading(false)
      return
    }

    try {
      // TODO: the correct Matrix identity should come from Okuna
      const fullIdentity = '@' + identity + ':' + chatServerName
      const { room_id } = await getOrCreateRoom([fullIdentity])

      if (!room_id) {
        openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
      } else {
        navigate('/chat/rooms/' + room_id)
      }
    } catch (e) {
      setIsLoading(false)
      openToast(t('chat.room.error.openRoom'), HoliToastType.ERROR)
    }

    setIsLoading(false)
  }

  return {
    startChat: (identity: string) => handleStartChat(identity),
    isLoading,
  }
}
