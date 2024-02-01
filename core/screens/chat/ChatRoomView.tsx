import { useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

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
import { useMatrixIdToHoliUserRecord } from '@holi/chat/src/utils/hooks'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { logError } from '@holi/core/errors/helpers'
import { getInitials } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

const WAIT_FOR_CHATROOM_DELAY = 5000

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParamHooks<ChatRoomPageParams>()

const ChatRoomView = () => {
  const { t } = useTranslation()
  const { navigateBack, replaceRoute } = useRouting()
  const chatInitialized = useChatInitialized()

  const [roomId = ''] = useParam('roomId')
  const [room, messages] = useRoomById(roomId)
  const { user: loggedInUser } = useLoggedInUser()
  const chatPartner = useAtomValue(useMemo(() => chatPartnerAtomCreator(roomId, loggedInUser), [loggedInUser, roomId]))

  const requestMessages = useRequestRoomMessages()
  const setScreenOptions = useSetScreenOptions()

  const roomMemberIds = room?.members.map((m) => m.id) ?? []
  const { matrixIdToHoliUserRecord, loading: loadingUsers } = useMatrixIdToHoliUserRecord(roomMemberIds)

  const amIRoomCreator = loggedInUser && room && isRoomCreator(loggedInUser, room)
  const chatPartnerHoliUser = getHoliUserForChatMember(chatPartner, matrixIdToHoliUserRecord)

  const isSpaceRoom = room && isSpaceChildChatRoom(room)

  const { openToast } = useToast()

  const handleBackPress = useCallback(async () => {
    navigateBack()
    await setLatestMessagesAsRead(roomId)
  }, [navigateBack, roomId])

  useEffect(() => {
    setScreenOptions({
      headerRight: () =>
        !!chatPartner &&
        !isSpaceRoom && (
          <ChatRoomActionDrawer
            roomId={roomId}
            chatPartner={chatPartner}
            chatPartnerFullName={chatPartnerHoliUser?.fullName ?? chatPartner.name}
          />
        ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} onPress={handleBackPress} />,
      headerTitle: () => {
        switch (room?.type) {
          case 'private':
            return (
              !!chatPartnerHoliUser &&
              !!chatPartner && (
                <ChatRoomHeaderTitle
                  href={'/profile/' + chatPartnerHoliUser.id}
                  name={chatPartnerHoliUser.fullName ?? chatPartner.name}
                  imageSrc={chatPartner.avatar}
                  imageBlurhash={chatPartnerHoliUser.avatarBlurhash}
                  initials={chatPartnerHoliUser.avatarLabel}
                  defaultColor={chatPartnerHoliUser.avatarDefaultColor}
                />
              )
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
      },
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [handleBackPress, chatPartner, setScreenOptions, chatPartnerHoliUser, roomId, room, isSpaceRoom])

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

  // TODO: provide skeleton instead of HoliLoader
  if (!chatInitialized || !room || loadingUsers) return <HoliLoader testID={'chat-room-loader'} />

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH} redirectRoute="/chat">
      <KeyboardAvoidingViewWrapper
        renderProp={() => (
          <View style={styles.container}>
            <View style={styles.listContainer}>
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
                  roomType={room?.type}
                  messages={messages || []}
                  matrixIdToHoliUserRecord={matrixIdToHoliUserRecord}
                  starter={
                    amIRoomCreator &&
                    chatPartnerHoliUser && (
                      <View style={styles.listStage}>
                        <RoomMessageListStart member={chatPartner} chatPartnerHoliUser={chatPartnerHoliUser} />
                      </View>
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
            </View>
            <ChatTextInput isVisible={!room.hasInvitation} userName={chatPartnerHoliUser?.fullName} roomId={roomId} />
          </View>
        )}
      />
    </PermissionsGuard>
  )
}

export default ChatRoomView

const styles = StyleSheet.create({
  headerTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    minHeight: '100%',
    paddingTop: dimensions.topBarHeight,
    backgroundColor: colors.background20,
  },
  listContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  listStage: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    maxWidth: dimensions.maxScreenWidth,
  },
})
