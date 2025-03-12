import { useAtomValue } from 'jotai'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useChatInitialized } from '@holi/chat/src/client/chatState'
import { chatPartnerAtomCreator, getHoliUserForChatMember, useRoomById } from '@holi/chat/src/store'
import { useMatrixIdToHoliUserRecord } from '@holi/chat/src/utils/hooks'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { logError } from '@holi/core/errors/helpers'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import PrivateRoomView from '@holi/core/screens/chat/ChatRoomView/PrivateRoomView'
import SpaceChildRoomView from '@holi/core/screens/chat/ChatRoomView/SpaceChildRoomView'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import SpaceTaskRoomView from '@holi/core/screens/chat/ChatRoomView/SpaceTaskRoomView'
import type { User } from '@holi/core/domain/shared/types'

const WAIT_FOR_CHATROOM_DELAY = 5000

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParamHooks<ChatRoomPageParams>()

const ChatRoomView = () => {
  const { t } = useTranslation()
  const { replaceRoute } = useRouting()
  const { openToast } = useToast()

  const chatInitialized = useChatInitialized()

  const [roomId = ''] = useParam('roomId')
  const { user: loggedInUser } = useLoggedInUser()
  const [room, messages] = useRoomById(roomId)

  const chatPartners =
    useAtomValue(useMemo(() => chatPartnerAtomCreator(roomId, loggedInUser), [loggedInUser, roomId])) ?? []
  const roomMemberIds = room?.members.map((m) => m.id) ?? []
  const { matrixIdToHoliUserRecord, loading: loadingUsers } = useMatrixIdToHoliUserRecord(roomMemberIds)

  const chatPartnerHoliUsers = chatPartners
    .map((chatPartner) => getHoliUserForChatMember(chatPartner, matrixIdToHoliUserRecord))
    .filter((holiUser) => holiUser !== undefined) as User[]

  useEffect(() => {
    if (chatInitialized && !room) {
      // redirect to Chat screen if no room is found after WAIT_FOR_CHATROOM_DELAY ms
      const timer = setTimeout(() => {
        if (chatInitialized && !room) {
          openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
          replaceRoute('/chat').catch((error) =>
            logError(error, 'Could not redirect logged in user to /chat', {
              location: 'ChatRoomView.useEffect',
            })
          )
        }
      }, WAIT_FOR_CHATROOM_DELAY)
      return () => clearTimeout(timer)
    }
  }, [chatInitialized, openToast, replaceRoute, t, room])

  if (!chatInitialized || !room || loadingUsers) return <HoliLoader testID={'chat-room-loader'} />

  const chatRoomViewProps = {
    messages,
    chatPartners,
    chatPartnerHoliUsers,
    loadingUsers,
    matrixIdToHoliUserRecord,
  } as const

  switch (room.type) {
    case 'private':
      return <PrivateRoomView room={room} {...chatRoomViewProps} />
    case 'space.child':
      return <SpaceChildRoomView room={room} {...chatRoomViewProps} />
    case 'space.task':
      return <SpaceTaskRoomView room={room} {...chatRoomViewProps} />
    case 'space':
    default:
      throw new HoliError(`Unsupported chat room type: ${room.type}`)
  }
}

export default ChatRoomView
