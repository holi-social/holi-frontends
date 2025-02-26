import React from 'react'

import ChatRoomHeaderTitle from '@holi/chat/src/components/ChatRoomHeaderTitle'
import { ChatTextInput } from '@holi/chat/src/components/ChatTextInput'
import RoomMessageListStart from '@holi/chat/src/components/RoomMessageList/RoomMessageListStart'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useTracking from '@holi/core/tracking/hooks/useTracking'

import type { SpaceTaskChatRoomProps } from './types'
import ChatRoomScreen from './components/ChatRoomScreen'
import { TrackingEvent } from '@holi/core/tracking'
import ChatProfileCard from '@holi/chat/src/components/ChatProfileCard'
import ChatRoomActionDrawer from '@holi/chat/src/components/ChatRoomActionDrawer'
import { useSpaceAdminUsers } from '@holi/core/screens/spaces/hooks/useSpaceAdminUsers'

const SpaceTaskRoomView = ({
  room,
  messages = [],
  chatPartners,
  chatPartnerHoliUsers,
  matrixIdToHoliUserRecord,
}: SpaceTaskChatRoomProps) => {
  const { track } = useTracking()

  const roomId = room.id
  const { taskId, taskName, holiSpaceId: spaceId, spaceName } = room.content

  const { adminUsers = [] } = useSpaceAdminUsers(spaceId)
  const chatPartnersWithoutAdmins = chatPartnerHoliUsers.filter(
    (user) => !adminUsers.some((admin) => admin.id === user.id)
  )

  const sendTrackingEvent = () => {
    track(
      TrackingEvent.Chat.MessageSent({
        roomId: room.id,
        type: 'space_task_message',
        content: 'text',
        spaceId,
        spaceName,
        taskId,
        taskName,
      })
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
          isTaskChat
          onMessageSent={sendTrackingEvent}
        />
      }
      headerOptions={{
        headerTitle: () => <ChatRoomHeaderTitle href={'/spaces/' + spaceId + '/tasks/' + taskId} name={taskName} />,
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        headerRight: () =>
          !!chatPartners && (
            <ChatRoomActionDrawer
              roomId={roomId}
              chatPartnerFullName={taskName}
              usersToBlock={chatPartnersWithoutAdmins}
            />
          ),
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      starter={
        <RoomMessageListStart
          members={chatPartners}
          chatPartnerHoliUsers={chatPartnerHoliUsers}
          taskName={taskName}
          taskId={taskId}
          parentSpaceId={spaceId}
          spaceName={spaceName}
        />
      }
      chatProfileCard={
        <ChatProfileCard
          member={room.creator ?? undefined}
          roomId={roomId}
          user={chatPartnerHoliUsers[0]}
          taskName={taskName}
        />
      }
    />
  )
}

export default SpaceTaskRoomView
