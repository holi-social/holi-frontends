import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import ChatProfileCard from '@holi/chat/src/components/ChatProfileCard'
import ChatRoomActionDrawer from '@holi/chat/src/components/ChatRoomActionDrawer'
import ChatRoomHeaderTitle from '@holi/chat/src/components/ChatRoomHeaderTitle'
import { ChatTextInput } from '@holi/chat/src/components/ChatTextInput'
import {
  getChatPartner,
  getHoliUserForChatMember,
  isRoomCreator,
  setLatestMessagesAsRead,
  useChatInitialized,
  useRequestRoomMessages,
  useRoomById,
} from '@holi/chat/src/store'
import { useMatrixIdToHoliUserRecord } from '@holi/chat/src/utils/hooks'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import RoomMessageList from '@holi/core/screens/chat/components/RoomMessageList'
import RoomMessageListStart from '@holi/core/screens/chat/components/RoomMessageList/RoomMessageListStart'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParam<ChatRoomPageParams>()

const ChatRoomView = () => {
  const { navigateBack } = useRouting()
  const chatInitialized = useChatInitialized()
  const mixins = useStyleMixins()

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

  const handleBackPress = useCallback(async () => {
    navigateBack()
    await setLatestMessagesAsRead(roomId)
  }, [navigateBack, roomId])

  useLayoutEffect(() => {
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
    if (room?.hasInvitation) return
    requestMessages(roomId, false)
  }, [requestMessages, roomId, room?.hasInvitation])

  // TODO: provide skeleton instead of HoliLoader
  if (!chatInitialized || !room || loadingUsers) return <HoliLoader />

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.inner}>
            <View style={[mixins.container, styles.innerVerticalLimiter]}>
              {room.hasInvitation ? (
                <ChatProfileCard roomId={roomId} user={chatPartnerHoliUser} userIsLoading={loadingUsers} />
              ) : (
                <RoomMessageList
                  messages={messages || []}
                  matrixIdToHoliUserRecord={matrixIdToHoliUserRecord}
                  starter={
                    amIRoomCreator &&
                    chatPartnerHoliUser && (
                      <HoliBox padding={[0, 16]}>
                        <RoomMessageListStart chatPartnerHoliUser={chatPartnerHoliUser} />
                      </HoliBox>
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

              <ChatTextInput isVisible={!room.hasInvitation} userName={chatPartnerHoliUser?.fullName} roomId={roomId} />
            </View>
          </View>
        </SafeAreaView>
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
  wrapper: {
    backgroundColor: colors.white100,
    flex: 1,
    ...Platform.select({
      web: {
        minHeight: '100%',
      },
    }),
  },
  inner: {
    backgroundColor: colors.background20,
    flex: 1,
  },
  innerVerticalLimiter: {
    flex: 1,
    paddingHorizontal: 0,
  },
  listFooterSpacer: {
    height: vars.topBarHeight,
  },
})
