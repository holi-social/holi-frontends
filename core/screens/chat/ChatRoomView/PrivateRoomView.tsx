import React from 'react'

import ChatProfileCard from '@holi/chat/src/components/ChatProfileCard'
import ChatRoomActionDrawer from '@holi/chat/src/components/ChatRoomActionDrawer'
import ChatRoomHeaderTitle from '@holi/chat/src/components/ChatRoomHeaderTitle'
import { ChatTextInput } from '@holi/chat/src/components/ChatTextInput'
import RoomMessageListStart from '@holi/chat/src/components/RoomMessageList/RoomMessageListStart'
import { isRoomCreator } from '@holi/chat/src/store'
import { getChatInitials, getDefaultAvatarColor } from '@holi/chat/src/utils'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useTracking from '@holi/core/tracking/hooks/useTracking'

import type { PrivateRoomViewProps } from './types'
import ChatRoomScreen from '@holi/core/screens/chat/ChatRoomView/components/ChatRoomScreen'
import { TrackingEvent } from '@holi/core/tracking'

const PrivateRoomView = ({
  room,
  messages = [],
  chatPartners,
  chatPartnerHoliUsers,
  matrixIdToHoliUserRecord,
}: PrivateRoomViewProps) => {
  const { track } = useTracking()

  const { user: loggedInUser } = useLoggedInUser()
  const amIRoomCreator = loggedInUser && room && isRoomCreator(loggedInUser, room)
  const roomId = room.id

  const sendTrackingEvent = () => {
    track(
      TrackingEvent.Chat.MessageSent({
        roomId: room.id,
        type: 'direct_message',
        content: 'text',
      })
    )
  }

  const headerTitle = () => {
    const chatPartner = chatPartners?.[0]
    const chatPartnerHoliUser = chatPartnerHoliUsers[0]

    return chatPartnerHoliUser ? (
      <ChatRoomHeaderTitle
        href={'/profile/' + chatPartnerHoliUser.id}
        name={room.name}
        imageSrc={chatPartner?.avatar}
        imageBlurhash={chatPartnerHoliUser.avatarBlurhash}
        initials={getChatInitials(chatPartner?.name)}
        defaultColor={getDefaultAvatarColor(chatPartner?.name)}
      />
    ) : null
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
        headerRight: () =>
          !!chatPartners && (
            <ChatRoomActionDrawer
              roomId={roomId}
              chatPartnerFullName={chatPartnerHoliUsers[0]?.fullName ?? chatPartners[0].name}
              usersToBlock={chatPartnerHoliUsers}
            />
          ),
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
      chatProfileCard={
        <ChatProfileCard member={room.creator ?? undefined} roomId={roomId} user={chatPartnerHoliUsers[0]} />
      }
    />
  )
}

export default PrivateRoomView
