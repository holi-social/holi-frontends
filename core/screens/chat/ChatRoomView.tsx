import { useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
  getParentSpaceByRoom,
  getTopicByRoomId,
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
import { isForbiddenError, isNotFoundError, logError } from '@holi/core/errors/helpers'
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
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import type { User } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { taskByIdQuery, type TaskByIdResponse } from '@holi/core/screens/spaces/details/queries'
import { useQuery } from '@apollo/client'
import { ChatTopics } from '@holi/chat/src/client/ChatClient'
import { useSpaceAdminUsers } from '@holi/core/screens/spaces/hooks/useAdmins'

const WAIT_FOR_CHATROOM_DELAY = 5000

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParamHooks<ChatRoomPageParams>()

const NUMBER_OF_TEXT_MESSAGES_NEEDED_TO_FILL_A_SCREEN_AND_CAUSE_SCROLLBARS = 40

const ChatRoomView = () => {
  const { t } = useTranslation()
  const { navigateBack, replaceRoute } = useRouting()
  const chatInitialized = useChatInitialized()
  const { styles } = useStyles(stylesheet)
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const [roomId = ''] = useParam('roomId')
  const [room, messages] = useRoomById(roomId)
  const { user: loggedInUser } = useLoggedInUser()
  const chatPartners = useAtomValue(useMemo(() => chatPartnerAtomCreator(roomId, loggedInUser), [loggedInUser, roomId]))

  const requestMessages = useRequestRoomMessages(NUMBER_OF_TEXT_MESSAGES_NEEDED_TO_FILL_A_SCREEN_AND_CAUSE_SCROLLBARS)
  const setScreenOptions = useSetScreenOptions()

  const roomMemberIds = room?.members.map((m) => m.id) ?? []
  const { matrixIdToHoliUserRecord, loading: loadingUsers } = useMatrixIdToHoliUserRecord(roomMemberIds)
  const [parentSpaceId, setParentSpaceId] = useState<string>()

  const amIRoomCreator = loggedInUser && room && isRoomCreator(loggedInUser, room)

  const { adminUsers } = useSpaceAdminUsers(parentSpaceId)

  const chatPartnerHoliUsers: User[] = (chatPartners || [])
    .map((chatPartner) => getHoliUserForChatMember(chatPartner, matrixIdToHoliUserRecord))
    .filter((holiUser): holiUser is User => holiUser !== undefined)

  const chatPartnersWithoutAdmins: User[] = chatPartnerHoliUsers.filter(
    (user) => !adminUsers?.some((admin) => admin.id === user.id)
  )

  const [taskId, setTaskId] = useState<string>()
  const isSpaceRoom = room && isSpaceChildChatRoom(room)

  const { openToast } = useToast()

  useEffect(() => {
    const isSpaceTaskChat = (type: unknown): type is ChatTopics.SpaceTaskChat => {
      return type === ChatTopics.SpaceTaskChat
    }
    const getTopic = async () => {
      try {
        const roomTopic = await getTopicByRoomId(roomId)
        const parentSpace = await getParentSpaceByRoom(roomId)
        if (isSpaceTaskChat(roomTopic?.topic)) {
          setTaskId(roomTopic.taskId)
          setParentSpaceId(parentSpace?.holiSpaceId)
        }
      } catch (error: unknown) {
        displayError(error, 'Failed to load room topic', {
          location: 'ChatRoomView.getTopic',
        })
      }
    }
    getTopic()
  }, [roomId, displayError])

  const { data } = useQuery<TaskByIdResponse>(taskByIdQuery, {
    variables: {
      id: taskId,
    },
    skip: !taskId,
    onError: (error) => {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      displayError(error, 'Failed to load task', {
        location: 'TaskDetails.taskByIdQuery',
      })
    },
  })
  const task = data?.taskById

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
            chatPartnerFullName={chatPartnerHoliUsers?.[0]?.fullName ?? chatPartners?.[0]?.name}
            usersToBlock={chatPartnersWithoutAdmins}
          />
        ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} onPress={handleBackPress} />,
      headerTitle: () => {
        if (loadingUsers) return null
        const chatPartner = chatPartners?.[0]
        const chatPartnerHoliUser = chatPartnerHoliUsers?.[0]

        switch (room?.type) {
          case 'private':
            return chatPartnerHoliUsers ? (
              <ChatRoomHeaderTitle
                href={'/profile/' + chatPartnerHoliUser?.id}
                name={room.name}
                imageSrc={chatPartner?.avatar}
                imageBlurhash={chatPartnerHoliUser?.avatarBlurhash}
                initials={getChatInitials(chatPartner?.name)}
                defaultColor={getDefaultAvatarColor(chatPartner?.name)}
              />
            ) : (
              <ChatRoomHeaderTitle
                name={chatPartner?.name ?? room.name}
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
    chatPartners,
    setScreenOptions,
    chatPartnerHoliUsers,
    roomId,
    room,
    isSpaceRoom,
    t,
    loadingUsers,
    chatPartnersWithoutAdmins,
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
    <HoliKeyboardSafeAreaView>
      <View style={styles.layoutWrapper}>
        <PermissionsGuard permissionType={PermissionsType.AUTH} redirectRoute="/chat">
          <HoliTransition.Fade visible style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.container}>
                <View style={styles.listContainer}>
                  {room.hasInvitation ? (
                    <ChatProfileCard
                      member={chatPartners?.[0]}
                      roomId={roomId}
                      user={chatPartnerHoliUsers?.[0]}
                      userIsLoading={loadingUsers}
                      taskName={task?.name}
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
                              task={task}
                              parentSpaceId={parentSpaceId}
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
                    userName={chatPartnerHoliUsers?.[0]?.fullName}
                    roomId={roomId}
                    isTaskChat={task !== undefined}
                    onMessageSent={sendTrackingEvent}
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
