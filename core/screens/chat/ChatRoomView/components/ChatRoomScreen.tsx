import type React from 'react'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import RoomMessageList from '@holi/chat/src/components/RoomMessageList'
import { useRequestRoomMessages } from '@holi/chat/src/store'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { useShowHeaderOnScreenFocus } from '@holi/core/helpers/useShowHeaderOnScreenFocus'
import { Screen } from '@holi/core/components/Screen'
import type { ScreenProps } from '@holi/core/components/Screen/types'
import type { ChatRoom, ChatRoomMessage, MatrixId } from '@holi/chat/src/client/types'
import type { RoomMessageListProps } from '@holi/chat/src/components/RoomMessageList/types'
import type { User } from '@holi/core/domain/shared/types'

export interface ChatRoomScreenProps
  extends Pick<ScreenProps, 'StickyBottomComponent' | 'headerOptions'>,
    Pick<RoomMessageListProps, 'onScroll' | 'starter'> {
  room: ChatRoom
  messages?: ChatRoomMessage[]
  chatProfileCard?: React.ReactNode
  matrixIdToHoliUserRecord: Record<MatrixId, User | undefined>
}

// number of text messages needed to fill a screen and cause scrollbars
const NUMBER_OF_INITIAL_MSGS = 40

const ChatRoomScreen = ({
  room,
  messages = [],
  StickyBottomComponent,
  headerOptions,
  starter: messageListStarter,
  chatProfileCard,
  matrixIdToHoliUserRecord,
}: ChatRoomScreenProps) => {
  const requestMessages = useRequestRoomMessages(NUMBER_OF_INITIAL_MSGS)

  // request initial chunk of room messages
  useEffect(() => {
    if (room.hasInvitation) return
    requestMessages(room.id, false)
  }, [requestMessages, room.id, room.hasInvitation])

  // reset header when screen is focused
  useShowHeaderOnScreenFocus()

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH} redirectRoute="/chat">
      <Screen
        preset="fixed"
        keyboardVerticalOffset={Platform.OS == 'ios' ? 168 : undefined} //FIXME: This is needed cause of a bug inside screen component that must be addressed.
        StickyBottomComponent={StickyBottomComponent}
        contentContainerStyle={{ flex: 1 }}
        headerOptions={headerOptions}
      >
        {room.hasInvitation ? (
          chatProfileCard
        ) : (
          <RoomMessageList
            roomId={room.id}
            messages={messages}
            matrixIdToHoliUserRecord={matrixIdToHoliUserRecord}
            starter={messageListStarter}
            onScroll={({ nativeEvent: { contentOffset, contentSize, layoutMeasurement } }) => {
              const needToLoad = contentSize.height - contentOffset.y < layoutMeasurement.height * 2

              if (needToLoad) {
                requestMessages(room.id, false)
              }
            }}
          />
        )}
      </Screen>
    </PermissionsGuard>
  )
}

export default ChatRoomScreen
