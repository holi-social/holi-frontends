import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import type { TrackingEvent } from '@holi/core/tracking'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useActionDrawerContext } from '@holi/ui/components/organisms/HoliActionDrawer/Drawer'
import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import type { User } from '@holi/core/domain/shared/types'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'

type StartChatButtonProps = {
  chatPartners?: User[]
  icon?: HoliIconType
  label: string
  trackingEvent: TrackingEvent
  getRoomId: () => Promise<string | undefined>
}

export const StartChatButton = ({
  chatPartners,
  icon,
  label,
  trackingEvent,
  getRoomId: getOrCreateRoom,
}: StartChatButtonProps) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { hideDrawer } = useActionDrawerContext()
  const { openSignupModal } = useSignupModal()
  const { openToast } = useToast()
  const { navigate } = useRouting()

  const [isLoading, setIsLoading] = useState(false)

  const safelyOpenSignupModal = () => {
    /* prevent having two modals open as startChat shows another one for guest, which breaks on ios */
    hideDrawer()

    openSignupModal({
      description: t('chat.start.loginRedirect.text'),
      trackTrigger: 'START_CHAT',
    })
  }

  async function openChatRoom(chatPartners: User[]) {
    try {
      const room_id = await getOrCreateRoom()

      if (!room_id) {
        openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
      } else {
        navigate('/chat/rooms/' + room_id)
        hideDrawer()
      }
    } catch (e) {
      logError(e, 'Failed to start contact-organization-chat with chat partner ' + chatPartners, {
        location: 'StartChatDrawerActionButton.openChatRoom',
      })
      openToast(t('chat.room.error.openRoom'), HoliToastType.ERROR)
    }
  }

  const startChat = async () => {
    if (!isLoggedIn) {
      safelyOpenSignupModal()
      return
    }

    if (!chatPartners) {
      logError(
        new HoliError('Can not create a chat without a space representatives identity'),
        'Failed to start chat',
        {
          location: 'StartChatDrawerActionButton.start',
        }
      )
      return
    }

    setIsLoading(true)
    try {
      await openChatRoom(chatPartners)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ButtonTracked
      trackingEvent={trackingEvent}
      loading={isLoading}
      disabled={isLoading}
      onPress={startChat}
      variant="primary"
      size="lg"
      icon={icon}
      label={label}
    />
  )
}
