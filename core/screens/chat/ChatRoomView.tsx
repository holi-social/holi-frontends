import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import ChatProfileCard from '@holi/chat/src/components/ChatProfileCard'
import { ChatTextInput } from '@holi/chat/src/components/ChatTextInput'
import { ChatRoom, sendMessage, useRequestRoomMessages, useRoomById } from '@holi/chat/src/store'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import RoomMessageList from '@holi/core/screens/chat/components/RoomMessageList'
import RoomMessageListStart from '@holi/core/screens/chat/components/RoomMessageList/RoomMessageListStart'
import {
  UsersByChatIdentitiesQueryVariables,
  UsersByChatIdentitiesResponse,
  usersByChatIdentitiesQuery,
} from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParam<ChatRoomPageParams>()

const useIdOrIdentityToUserRecord = (room: ChatRoom | null) => {
  const userNames = room?.members.map(({ name }) => name) ?? []

  const { data, loading } = useQuery<UsersByChatIdentitiesResponse, UsersByChatIdentitiesQueryVariables>(
    usersByChatIdentitiesQuery,
    {
      variables: {
        identities: userNames,
        offset: 0,
        limit: userNames.length,
      },
      skip: !userNames.length,
    }
  )
  const users = data?.usersByChatIdentities.data ?? []
  const roomUsersRecord: Record<string, User> = users.reduce((acc, user) => {
    const mxUserId = room?.members.find((member) => member.name === user.identity)?.id
    if (mxUserId) {
      return { ...acc, [mxUserId]: user, [user.identity]: user }
    }
    return acc
  }, {})

  return {
    roomUsersRecord,
    loading,
  }
}

const ChatRoomView = () => {
  const { t } = useTranslation()

  const [roomId = ''] = useParam('roomId')
  const [room, messages] = useRoomById(roomId)

  const { roomUsersRecord, loading: loadingUsers } = useIdOrIdentityToUserRecord(room)
  const [messageText, setMessageText] = useState('')

  const { user: me } = useLoggedInUser()
  const requestMessages = useRequestRoomMessages()
  useEffect(() => {
    requestMessages(roomId)
  }, [requestMessages, roomId])

  const amIRoomCreator = Boolean(room?.creator?.name && me?.identity && room.creator?.name == me?.identity)
  const roomCreator = roomUsersRecord[room?.name ?? '']
  const setScreenOptions = useSetScreenOptions()

  useEffect(() => {
    setScreenOptions({
      headerTitle: () =>
        roomCreator ? (
          <HoliLink label={t('user.visitProfile', { name: roomCreator.fullName })} href={`/profile/${roomCreator.id}`}>
            <View style={styles.headerTitle}>
              <HoliAvatar
                imageSrc={roomCreator.avatar}
                imageBlurhash={roomCreator.avatarBlurhash}
                label={roomCreator.fullName}
                initials={roomCreator.avatarLabel}
                defaultColor={roomCreator.avatarDefaultColor}
                size="micro"
              />
              <HoliText bold>{roomCreator.fullName}</HoliText>
            </View>
          </HoliLink>
        ) : null,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [roomCreator, room?.name, setScreenOptions, t])

  const handleSendMessage = async () => {
    const text = messageText.trim()
    if (!text) return

    await sendMessage({ roomId, text })
    setMessageText('')
  }

  // TODO: provide skeleton instead of HoliLoader
  if (!room || loadingUsers) return <HoliLoader />

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeAreaView style={styles.wrapper}>
          <View style={{ backgroundColor: colors.background20, flex: 1 }}>
            {room.hasInvitation ? (
              <ChatProfileCard roomId={roomId} user={roomCreator} userIsLoading={loadingUsers} />
            ) : (
              <RoomMessageList
                messages={messages}
                mxIdUserRecord={roomUsersRecord}
                starter={
                  amIRoomCreator &&
                  roomCreator && (
                    <HoliBox padding={[0, 16]}>
                      <RoomMessageListStart user={roomCreator} />
                    </HoliBox>
                  )
                }
                onScroll={({ nativeEvent: { contentOffset, contentSize, layoutMeasurement } }) => {
                  const needToLoad = contentSize.height - contentOffset.y < layoutMeasurement.height * 2

                  if (needToLoad) {
                    requestMessages(roomId)
                  }
                }}
              />
            )}

            <ChatTextInput
              isVisible={!room.hasInvitation}
              text={messageText}
              setText={setMessageText}
              onPress={handleSendMessage}
            />
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
  listFooterSpacer: {
    height: vars.topBarHeight,
  },
})
