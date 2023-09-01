import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useChatInitialized } from '@holi/chat/src/client/chatSession'
import ChatProfileCard from '@holi/chat/src/components/ChatProfileCard'
import ChatRoomActionDrawer from '@holi/chat/src/components/ChatRoomActionDrawer'
import ChatRoomHeaderTitle from '@holi/chat/src/components/ChatRoomHeaderTitle'
import { ChatTextInput } from '@holi/chat/src/components/ChatTextInput'
import RoomMessageList from '@holi/chat/src/components/RoomMessageList'
import RoomMessageListStart from '@holi/chat/src/components/RoomMessageList/RoomMessageListStart'
import {
  getChatPartner,
  getHoliUserForChatMember,
  isRoomCreator,
  setLatestMessagesAsRead,
  useRequestRoomMessages,
  useRoomById,
} from '@holi/chat/src/store'
import { useMatrixIdToHoliUserRecord } from '@holi/chat/src/utils/hooks'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import { logError } from '@holi/core/errors/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParam<ChatRoomPageParams>()

const ChatRoomView = () => {
  const { t } = useTranslation()
  const { navigateBack, replaceRoute } = useRouting()
  const chatInitialized = useChatInitialized()

  const [roomId = ''] = useParam('roomId')
  const [room, messages] = useRoomById(roomId)

  const { matrixIdToHoliUserRecord, loading: loadingUsers } = useMatrixIdToHoliUserRecord(
    room?.members.map((m) => m.id) || []
  )

  const { user: loggedInUser } = useLoggedInUser()
  const requestMessages = useRequestRoomMessages()
  const setScreenOptions = useSetScreenOptions()

  const amIRoomCreator = loggedInUser && room && isRoomCreator(loggedInUser, room)
  const chatPartner = loggedInUser && room && getChatPartner(loggedInUser, room)
  const chatPartnerHoliUser = getHoliUserForChatMember(chatPartner, matrixIdToHoliUserRecord)

  const { userId } = useAuth()
  const notLoggedIn = userId === null
  const { openToast } = useToast()

  const handleBackPress = useCallback(async () => {
    navigateBack()
    await setLatestMessagesAsRead(roomId)
  }, [navigateBack, roomId])

  useEffect(() => {
    setScreenOptions({
      headerRight: () =>
        !!chatPartner && (
          <ChatRoomActionDrawer
            roomId={roomId}
            chatPartner={chatPartner}
            chatPartnerFullName={chatPartnerHoliUser?.fullName ?? chatPartner.name}
          />
        ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} onPress={handleBackPress} />,
      headerTitle: () => !!chatPartnerHoliUser && <ChatRoomHeaderTitle user={chatPartnerHoliUser} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [handleBackPress, chatPartner, setScreenOptions, chatPartnerHoliUser, roomId])

  useEffect(() => {
    // redirect not logged in user to Chat screen
    if (notLoggedIn) {
      replaceRoute('/chat').catch(logError)
      return
    }
    // redirect logged in user to Chat screen if room not found
    if (chatInitialized && !room) {
      openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
      replaceRoute('/chat').catch(logError)
    }
  }, [chatInitialized, notLoggedIn, openToast, replaceRoute, room, t])

  // request initial chunk of room messages
  useEffect(() => {
    if (!room?.id || room?.hasInvitation) return
    requestMessages(roomId, false)
  }, [requestMessages, roomId, room?.id, room?.hasInvitation])

  // TODO: provide skeleton instead of HoliLoader
  if (!chatInitialized || !room || loadingUsers) return <HoliLoader testID={'chat-room-loader'} />

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <View style={styles.container}>
          <View style={styles.listContainer}>
            {room.hasInvitation ? (
              <ChatProfileCard roomId={roomId} user={chatPartnerHoliUser} userIsLoading={loadingUsers} />
            ) : (
              <RoomMessageList
                messages={messages || []}
                matrixIdToHoliUserRecord={matrixIdToHoliUserRecord}
                starter={
                  amIRoomCreator &&
                  chatPartnerHoliUser && (
                    <View style={styles.listStage}>
                      <RoomMessageListStart chatPartnerHoliUser={chatPartnerHoliUser} />
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
    paddingTop: vars.topBarHeight,
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
    maxWidth: vars.maxScreenWidth,
  },
})
