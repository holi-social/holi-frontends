import React from 'react'

import ChatRoomHeaderTitle from '@holi/chat/src/components/ChatRoomHeaderTitle'
import { ChatTextInput } from '@holi/chat/src/components/ChatTextInput'
import RoomMessageListStart from '@holi/chat/src/components/RoomMessageList/RoomMessageListStart'
import { isRoomCreator } from '@holi/chat/src/store'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { getInitials } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useTracking from '@holi/core/tracking/hooks/useTracking'

import type { SpaceChildChatRoomProps } from './types'
import ChatRoomScreen from './components/ChatRoomScreen'
import { TrackingEvent } from '@holi/core/tracking'

const SpaceChildRoomView = ({
  room,
  messages = [],
  chatPartners,
  chatPartnerHoliUsers,
  matrixIdToHoliUserRecord,
}: SpaceChildChatRoomProps) => {
  const { track } = useTracking()

  const { user: loggedInUser } = useLoggedInUser()
  const amIRoomCreator = loggedInUser && room && isRoomCreator(loggedInUser, room)
  const roomId = room.id

  const sendTrackingEvent = () => {
    track(
      TrackingEvent.Chat.MessageSent({
        roomId: room.id,
        type: 'space_message',
        content: 'text',
        spaceId: room.content.holiSpaceId,
        spaceName: room.content.spaceName,
      })
    )
  }

  const headerTitle = () => {
    return (
      <ChatRoomHeaderTitle
        href={'/spaces/' + room.content.holiSpaceId}
        name={room.content.spaceName}
        initials={getInitials(room.content.spaceName)}
        imageSrc={room.avatar}
        defaultColor={room.content.avatarDefaultColor}
        shape="square"
      />
    )
  }

  return (
    <ChatRoomScreen
      room={room}
      messages={messages}
      matrixIdToHoliUserRecord={matrixIdToHoliUserRecord}
      StickyBottomComponent={
        <ChatTextInput
          isVisible={!room.hasInvitation}
          userName={chatPartnerHoliUsers[0]?.fullName}
          roomId={roomId}
          onMessageSent={sendTrackingEvent}
        />
      }
      headerOptions={{
        headerTitle,
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      starter={
        amIRoomCreator &&
        chatPartnerHoliUsers[0] && (
          <RoomMessageListStart members={chatPartners} chatPartnerHoliUsers={chatPartnerHoliUsers} />
        )
      }
    />
  )
}

export default SpaceChildRoomView
