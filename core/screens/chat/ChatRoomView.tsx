import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import ChatProfileCard from '@holi/chat/src/components/ChatProfileCard'
import { ChatTextInput } from '@holi/chat/src/components/ChatTextInput'
import {
  ignoreUser,
  sendMessage,
  setLatestMessagesAsRead,
  unignoreUser,
  useChatInitialized,
  useIgnoredUsers,
  useRequestRoomMessages,
  useRoomById,
} from '@holi/chat/src/store'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import {
  getChatPartner,
  isRoomCreator,
  useMatrixIdToHoliUserRecord,
} from '@holi/core/screens/chat/components/RoomList/helpers'
import RoomMessageList from '@holi/core/screens/chat/components/RoomMessageList'
import RoomMessageListStart from '@holi/core/screens/chat/components/RoomMessageList/RoomMessageListStart'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParam<ChatRoomPageParams>()

const ChatRoomView = () => {
  const { t } = useTranslation()
  const { navigateBack } = useRouting()
  const chatInitialized = useChatInitialized()
  const mixins = useStyleMixins()

  const [roomId = ''] = useParam('roomId')
  const [room, messages] = useRoomById(roomId)

  const { matrixIdToHoliUserRecord, loading: loadingUsers } = useMatrixIdToHoliUserRecord(
    room?.members.map((m) => m.id) || []
  )
  const [messageText, setMessageText] = useState('')

  const { user: loggedInUser } = useLoggedInUser()
  const requestMessages = useRequestRoomMessages()

  const amIRoomCreator = loggedInUser && room && isRoomCreator(loggedInUser, room)
  const chatPartner = loggedInUser && room && getChatPartner(loggedInUser, room)
  const chatPartnerHoliUser = chatPartner && matrixIdToHoliUserRecord[chatPartner.id]
  const setScreenOptions = useSetScreenOptions()
  const ignoredUsers = useIgnoredUsers()

  const handleBackPress = useCallback(async () => {
    navigateBack()
    await setLatestMessagesAsRead(roomId)
  }, [navigateBack, roomId])

  useLayoutEffect(() => {
    setScreenOptions({
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} onPress={handleBackPress} />,
      headerTitle: () => {
        if (!chatPartner || !chatPartnerHoliUser) return null
        const isUserIgnored = ignoredUsers.includes(chatPartner.id)
        const blockLabel = isUserIgnored
          ? t('chat.user.unblock', { user: chatPartnerHoliUser.fullName })
          : t('chat.user.block', { user: chatPartnerHoliUser.fullName })
        const blockAction = isUserIgnored
          ? () => unignoreUser(chatPartner.id).then(() => requestMessages(roomId, true))
          : () => ignoreUser(chatPartner.id).then(() => requestMessages(roomId, true))
        return (
          <View style={{ flexDirection: 'row', columnGap: 20 }}>
            <HoliLink
              label={t('user.visitProfile', { name: chatPartnerHoliUser.fullName })}
              href={`/profile/${chatPartner.id}`}
            >
              <View style={styles.headerTitle}>
                <HoliAvatar
                  imageSrc={chatPartnerHoliUser.avatar}
                  imageBlurhash={chatPartnerHoliUser.avatarBlurhash}
                  label={chatPartnerHoliUser.fullName}
                  initials={chatPartnerHoliUser.avatarLabel}
                  defaultColor={chatPartnerHoliUser.avatarDefaultColor}
                  size="micro"
                />
                <HoliText bold>{chatPartnerHoliUser.fullName}</HoliText>
              </View>
            </HoliLink>
            <HoliButton inline variant="small" type="secondary" label={blockLabel} onPress={blockAction}>
              {blockLabel}
            </HoliButton>
          </View>
        )
      },
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [
    handleBackPress,
    chatPartner,
    room?.name,
    setScreenOptions,
    t,
    ignoredUsers,
    chatPartnerHoliUser,
    requestMessages,
    roomId,
  ])

  useEffect(() => {
    if (room?.hasInvitation) return
    requestMessages(roomId, false)
  }, [requestMessages, roomId, room?.hasInvitation])

  const handleSendMessage = async () => {
    const text = messageText.trim()
    if (!text) return

    await sendMessage({ roomId, text })
    setMessageText('')
  }

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

              <ChatTextInput
                isVisible={!room.hasInvitation}
                text={messageText}
                setText={setMessageText}
                userName={chatPartnerHoliUser?.fullName}
                onPress={handleSendMessage}
              />
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
