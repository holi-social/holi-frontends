import { useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
// eslint-disable-next-line no-restricted-imports
import { Keyboard, Platform } from 'react-native'

import { useChatInitialized } from '@holi/chat/src/client/chatState'
import ChatProfileCard from '@holi/chat/src/components/ChatProfileCard'
import ChatRoomActionDrawer from '@holi/chat/src/components/ChatRoomActionDrawer'
import ChatRoomHeaderTitle from '@holi/chat/src/components/ChatRoomHeaderTitle'
import { ChatTextInput } from '@holi/chat/src/components/ChatTextInput'
import RoomMessageList from '@holi/chat/src/components/RoomMessageList'
import RoomMessageListStart from '@holi/chat/src/components/RoomMessageList/RoomMessageListStart'
import {
  chatPartnerAtomCreator,
  getHoliUserForChatMember,
  isRoomCreator,
  setLatestMessagesAsRead,
  useRequestRoomMessages,
  useRoomById,
} from '@holi/chat/src/store'
import { isSpaceChildChatRoom } from '@holi/chat/src/store/utils'
import { getChatInitials, getDefaultAvatarColor } from '@holi/chat/src/utils'
import { useMatrixIdToHoliUserRecord } from '@holi/chat/src/utils/hooks'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { logError } from '@holi/core/errors/helpers'
import { getInitials } from '@holi/core/helpers'
import { useShowHeaderOnScreenFocus } from '@holi/core/helpers/useShowHeaderOnScreenFocus'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Screen } from '@holi/core/components/Screen'

const WAIT_FOR_CHATROOM_DELAY = 5000

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParamHooks<ChatRoomPageParams>()

// number of text messages needed to fill a screen and cause scrollbars
const NUMBER_OF_INITIAL_MSGS = 40

const ChatRoomView = () => {
  const { t } = useTranslation()
  const { navigateBack, replaceRoute } = useRouting()
  const chatInitialized = useChatInitialized()
  const { track } = useTracking()

  const [roomId = ''] = useParam('roomId')
  const [room, messages] = useRoomById(roomId)
  const { user: loggedInUser } = useLoggedInUser()
  const chatPartner = useAtomValue(useMemo(() => chatPartnerAtomCreator(roomId, loggedInUser), [loggedInUser, roomId]))

  const requestMessages = useRequestRoomMessages(NUMBER_OF_INITIAL_MSGS)

  const roomMemberIds = room?.members.map((m) => m.id) ?? []
  const { matrixIdToHoliUserRecord, loading: loadingUsers } = useMatrixIdToHoliUserRecord(roomMemberIds)

  const amIRoomCreator = loggedInUser && room && isRoomCreator(loggedInUser, room)
  const chatPartnerHoliUser = getHoliUserForChatMember(chatPartner, matrixIdToHoliUserRecord)

  const isSpaceRoom = room && isSpaceChildChatRoom(room)

  const { openToast } = useToast()

  const handleBackPress = useCallback(async () => {
    await setLatestMessagesAsRead(roomId)

    /** WORKAROUND: probably bug in `useAnimatedStyle` from `react-native-reanimated` for Android
     * For Android we need wait till keyboard is hidden before navigating back
     * Otherwise the `useAnimatedStyle` in `HoliKeyboardSafeAreaView` will not get updated
     * and the view will be stuck in the keyboard position
     */
    if (Platform.OS === 'android' && Keyboard.isVisible()) {
      const unsubscribe = Keyboard.addListener('keyboardDidHide', () => {
        navigateBack('/chat')
        unsubscribe?.remove()
      })
      Keyboard.dismiss()
    } else {
      navigateBack('/chat')
    }
  }, [navigateBack, roomId])

  const headerTitle = () => {
    if (loadingUsers) return null
    switch (room?.type) {
      case 'private':
        return chatPartnerHoliUser ? (
          <ChatRoomHeaderTitle
            href={'/profile/' + chatPartnerHoliUser.id}
            name={room.name}
            imageSrc={chatPartner?.avatar}
            imageBlurhash={chatPartnerHoliUser.avatarBlurhash}
            initials={getChatInitials(chatPartner?.name)}
            defaultColor={getDefaultAvatarColor(chatPartner?.name)}
          />
        ) : (
          <ChatRoomHeaderTitle
            name={room.name}
            imageSrc={chatPartner?.avatar}
            initials={getChatInitials(chatPartner?.name)}
            defaultColor={getDefaultAvatarColor(chatPartner?.name)}
          />
        )

      case 'space.child':
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

      default:
        return null
    }
  }

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

  // request initial chunk of room messages
  useEffect(() => {
    if (!room?.id || room?.hasInvitation) return
    requestMessages(roomId, false)
  }, [requestMessages, roomId, room?.id, room?.hasInvitation])

  // reset header when screen is focused
  useShowHeaderOnScreenFocus()

  const sendTrackingEvent = () => {
    if (!loggedInUser || !room) return

    if (isSpaceRoom) {
      track(
        TrackingEvent.Chat.MessageSent({
          roomId: room.id,
          type: 'space_message',
          content: 'text',
          spaceId: room.content.holiSpaceId,
          spaceName: room.content.spaceName,
        })
      )
    } else {
      track(
        TrackingEvent.Chat.MessageSent({
          roomId: room.id,
          type: 'direct_message',
          content: 'text',
        })
      )
    }
  }

  // TODO: provide skeleton instead of HoliLoader
  if (!chatInitialized || !room || loadingUsers) return <HoliLoader testID={'chat-room-loader'} />

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH} redirectRoute="/chat">
      <Screen
        preset="fixed"
        keyboardVerticalOffset={Platform.OS == 'ios' ? 168 : undefined} //FIXME: This is needed cause of a bug inside screen component that must be addressed.
        StickyBottomComponent={
          <ChatTextInput
            isVisible={!room.hasInvitation}
            userName={chatPartnerHoliUser?.fullName}
            roomId={roomId}
            onMessageSent={sendTrackingEvent}
          />
        }
        contentContainerStyle={{ flex: 1 }}
        headerOptions={{
          headerTitle,
          headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} onPress={handleBackPress} />,
          headerRight: () =>
            !!chatPartner &&
            !isSpaceRoom && (
              <ChatRoomActionDrawer
                roomId={roomId}
                chatPartner={chatPartner}
                chatPartnerFullName={chatPartnerHoliUser?.fullName ?? chatPartner.name}
              />
            ),
          navigationCustomOptions: {
            footerShown: false,
          },
        }}
      >
        {room.hasInvitation ? (
          <ChatProfileCard
            member={chatPartner}
            roomId={roomId}
            user={chatPartnerHoliUser}
            userIsLoading={loadingUsers}
          />
        ) : (
          <RoomMessageList
            roomId={room.id}
            messages={messages || []}
            matrixIdToHoliUserRecord={matrixIdToHoliUserRecord}
            starter={
              amIRoomCreator &&
              chatPartnerHoliUser && (
                <RoomMessageListStart member={chatPartner} chatPartnerHoliUser={chatPartnerHoliUser} />
              )
            }
            onScroll={({ nativeEvent: { contentOffset, contentSize, layoutMeasurement } }) => {
              const needToLoad = contentSize.height - contentOffset.y < layoutMeasurement.height * 2

              if (needToLoad) {
                requestMessages(roomId, false)
              }
            }}
          />
        )}
      </Screen>
    </PermissionsGuard>
  )
}

export default ChatRoomView
