import { useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
// eslint-disable-next-line no-restricted-imports
import { Keyboard, Platform, SafeAreaView, View } from 'react-native'

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
import { isSpaceChildChatRoom, isSpaceTaskChatRoom } from '@holi/chat/src/store/utils'
import { getChatInitials, getDefaultAvatarColor } from '@holi/chat/src/utils'
import { useMatrixIdToHoliUserRecord } from '@holi/chat/src/utils/hooks'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { logError } from '@holi/core/errors/helpers'
import { getInitials } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useShowHeaderOnScreenFocus } from '@holi/core/helpers/useShowHeaderOnScreenFocus'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliKeyboardSafeAreaView from '@holi/ui/components/organisms/HoliKeyboardSafeAreaView'
import { dimensions } from '@holi/ui/styles/globalVars'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import type { User } from '@holi/core/domain/shared/types'

const WAIT_FOR_CHATROOM_DELAY = 5000

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParamHooks<ChatRoomPageParams>()

const ChatRoomView = () => {
  const { t } = useTranslation()
  const { navigateBack, replaceRoute } = useRouting()
  const chatInitialized = useChatInitialized()
  const { styles } = useStyles(stylesheet)

  const [roomId = ''] = useParam('roomId')
  const [room, messages] = useRoomById(roomId)
  const { user: loggedInUser } = useLoggedInUser()
  const chatPartners = useAtomValue(useMemo(() => chatPartnerAtomCreator(roomId, loggedInUser), [loggedInUser, roomId]))

  const requestMessages = useRequestRoomMessages()
  const setScreenOptions = useSetScreenOptions()

  const roomMemberIds = room?.members.map((m) => m.id) ?? []
  const { matrixIdToHoliUserRecord, loading: loadingUsers } = useMatrixIdToHoliUserRecord(roomMemberIds)

  const amIRoomCreator = loggedInUser && room && isRoomCreator(loggedInUser, room)
  const chatPartnerHoliUsers: User[] = (chatPartners || [])
    .map((chatPartner) => getHoliUserForChatMember(chatPartner, matrixIdToHoliUserRecord))
    .filter((holiUser): holiUser is User => holiUser !== undefined)

  const isSpaceRoom = room && isSpaceChildChatRoom(room)
  // const isTaskRoom = room && isSpaceTaskChatRoom(room) // todo

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
        navigateBack()
        unsubscribe?.remove()
      })
      Keyboard.dismiss()
    } else {
      navigateBack()
    }
  }, [navigateBack, roomId])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerRight: () =>
        !!chatPartners &&
        !isSpaceRoom && (
          <ChatRoomActionDrawer
            roomId={roomId}
            chatPartner={chatPartners[0]}
            chatPartnerFullName={chatPartnerHoliUsers?.[0]?.fullName ?? chatPartners?.[0]?.name} // todo: if its a task chat: design decision
          />
        ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} onPress={handleBackPress} />,
      headerTitle: () => {
        if (loadingUsers) return null

        switch (room?.type) {
          case 'private':
            return chatPartnerHoliUsers ? (
              <ChatRoomHeaderTitle
                href={'/profile/' + chatPartnerHoliUsers?.[0]?.id}
                name={room.name}
                imageSrc={chatPartners?.[0]?.avatar}
                imageBlurhash={chatPartnerHoliUsers?.[0]?.avatarBlurhash}
                initials={getChatInitials(chatPartners?.[0]?.name)}
                defaultColor={getDefaultAvatarColor(chatPartners?.[0]?.name)}
              />
            ) : (
              <ChatRoomHeaderTitle
                name={chatPartners?.[0]?.name ?? room.name}
                imageSrc={chatPartners?.[0]?.avatar}
                initials={getChatInitials(chatPartners?.[0]?.name)}
                defaultColor={getDefaultAvatarColor(chatPartners?.[0]?.name)}
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

          case 'space.task':
            return (
              <ChatRoomHeaderTitle
                href={'/spaces/' + room.content.holiSpaceId + '/tasks/' + room.content.taskId} // todo: to be checked
                name={room.content.taskName}
                initials={getInitials(room.content.taskName)}
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
  }, [
    handleBackPress,
    chatPartners,
    setScreenOptions,
    chatPartnerHoliUsers,
    roomId,
    room,
    isSpaceRoom,
    t,
    loadingUsers,
  ])

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

  // TODO: provide skeleton instead of HoliLoader
  if (!chatInitialized || !room || loadingUsers) return <HoliLoader testID={'chat-room-loader'} />

  return (
    <HoliKeyboardSafeAreaView>
      <View style={styles.layoutWrapper}>
        <PermissionsGuard permissionType={PermissionsType.AUTH} redirectRoute="/chat">
          <HoliTransition.Fade visible style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.container}>
                <View style={styles.listContainer}>
                  {room.hasInvitation ? ( // note: this case will never happen with a group chat / task chat
                    <ChatProfileCard
                      member={chatPartners?.[0]}
                      roomId={roomId}
                      user={chatPartnerHoliUsers?.[0]}
                      userIsLoading={loadingUsers}
                    />
                  ) : (
                    <RoomMessageList
                      roomId={room.id}
                      messages={messages || []}
                      matrixIdToHoliUserRecord={matrixIdToHoliUserRecord}
                      starter={
                        amIRoomCreator &&
                        chatPartnerHoliUsers && (
                          <View style={styles.listStage}>
                            <RoomMessageListStart
                              members={chatPartners}
                              chatPartnerHoliUsers={chatPartnerHoliUsers}
                              taskName={isSpaceTaskChatRoom(room) ? room.content.taskName : room.name}
                            />
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

                <HoliContainer noPadding>
                  <ChatTextInput
                    isVisible={!room.hasInvitation}
                    userName={chatPartnerHoliUsers?.[0]?.fullName} // todo: only "Write a message" if its a task chat
                    roomId={roomId}
                  />
                </HoliContainer>
              </View>
            </SafeAreaView>
          </HoliTransition.Fade>
        </PermissionsGuard>
      </View>
    </HoliKeyboardSafeAreaView>
  )
}

export default ChatRoomView

const stylesheet = createStyleSheet((theme) => ({
  layoutWrapper: {
    ...Platform.select({
      web: {
        height: '100%',
      },
      native: {
        flex: 1,
      },
    }),
  },
  safeArea: {
    flex: 1,
  },
  headerTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.bg.container,
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
}))
