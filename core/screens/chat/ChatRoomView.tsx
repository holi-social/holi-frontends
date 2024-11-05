import { useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, StyleSheet, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

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
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliKeyboardSafeAreaView from '@holi/ui/components/organisms/HoliKeyboardSafeAreaView'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const WAIT_FOR_CHATROOM_DELAY = 5000

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParamHooks<ChatRoomPageParams>()

const ChatRoomView = () => {
  const { t } = useTranslation()
  const { navigateBack, replaceRoute } = useRouting()
  const chatInitialized = useChatInitialized()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

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

  useEffect(() => {
    setScreenOptions({
      headerTransparent: false,
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
      },
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [
    handleBackPress,
    chatPartner,
    setScreenOptions,
    chatPartnerHoliUser,
    roomId,
    room,
    isSpaceRoom,
    t,
    loadingUsers,
    colors.brandColorD20,
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
      <View style={styles.layoutWarpper}>
        <PermissionsGuard permissionType={PermissionsType.AUTH} redirectRoute="/chat">
          <Animated.View entering={FadeIn} style={{ flex: 1 }}>
            <SafeArea style={styles.safeArea}>
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

                <ChatTextInput
                  isVisible={!room.hasInvitation}
                  userName={chatPartnerHoliUser?.fullName}
                  roomId={roomId}
                />
              </View>
            </SafeArea>
          </Animated.View>
        </PermissionsGuard>
      </View>
    </HoliKeyboardSafeAreaView>
  )
}

export default ChatRoomView

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layoutWarpper: {
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
      backgroundColor: theme.colors.background20,
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
