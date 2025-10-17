import { useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getOrCreateSpaceTaskRoom, toMatrixIdentity } from '@holi/chat/src/store'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useTranslation } from 'react-i18next'
import type { SpaceTaskSharedDataContent } from '@holi/chat/src/client/types'

export const useStartChat = (
  content: SpaceTaskSharedDataContent,
  adminUsers: {
    __typename?: 'User' | undefined
    id: string
    identity?: string | undefined
    avatar?: string | undefined
    avatarBlurhash?: string | undefined
    avatarLabel: string
    avatarDefaultColor: string
    firstName?: string | undefined
    fullName: string
  }[]
) => {
  const { displayError } = useErrorHandling()
  const [isLoading, setIsLoading] = useState(false)
  const { openToast } = useToast()
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const { taskId, spaceName: spaceTitle, holiSpaceId: spaceId } = content
  const [roomId, setRoomId] = useState<string>('')

  const startChat = async (supressNavigation?: boolean) => {
    // console.log('startChat called with', { content, adminUsers })
    setIsLoading(true)
    try {
      if (!spaceId || !taskId || !spaceTitle) {
        displayError(new Error('Cannot create a task room chat'), 'Cannot create a task room chat', {
          location: 'useStartChat.startChat',
          spaceTitle,
        })
        return undefined
      }

      if (!adminUsers) {
        displayError(new Error('No space admins found'), 'No space admins found', {
          location: 'useStartChat.startChat',
          spaceTitle,
        })
        return undefined
      }

      const chatPartnerMatrixIds = adminUsers.map(({ identity }) => toMatrixIdentity(identity ?? ''))
      // console.log('chatPartnerMatrixIds', chatPartnerMatrixIds)
      // console.log('content', content)

      const { room_id } = await getOrCreateSpaceTaskRoom(chatPartnerMatrixIds, {
        type: 'space.task',
        content,
      })
      // console.log('room_id', room_id)

      if (!room_id) {
        openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
      } else {
        setRoomId(room_id)
        if (!supressNavigation) {
          navigate('/chat/rooms/' + room_id)
        }
        return room_id
        // lastMessageByRoomIdAtomCreator(room_id)
      }
    } catch (e) {
      logError(e, 'Failed to start contact-organization-chat with chat partner ' + adminUsers, {
        location: 'useStartChat.startChat',
      })
      openToast(t('chat.room.error.openRoom'), HoliToastType.ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  return { startChat, isLoading, roomId }
}
