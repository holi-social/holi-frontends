import { useQuery } from '@apollo/client'
import { useAtomValue } from 'jotai'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import { ChatRoomMember } from '@holi/chat/src/client/types'
import ChatProfileCard from '@holi/chat/src/components/ChatProfileCard'
import { ChatTextInput } from '@holi/chat/src/components/ChatTextInput'
import {
  ChatRoom,
  chatInitializedAtom,
  ignoreUser,
  sendMessage,
  unignoreUser,
  useIgnoredUsers,
  useRequestRoomMessages,
  useRoomById,
} from '@holi/chat/src/store'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import { chatServerName } from '@holi/core/helpers/config'
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
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParam<ChatRoomPageParams>()

type HoliIdentity = string
type MatrixId = string // TODO create value type that ensures this is a valid Matrix ID

const toHoliIdentity = (matrixId: MatrixId): HoliIdentity => matrixId.replace('@', '').replace(`:${chatServerName}`, '')

const useMatrixIdToHoliUserRecord = (room: ChatRoom | null) => {
  const roomMemberMatrixIds = room?.members.map((member) => member.id) ?? []
  const roomMemberHoliIdentities = room?.members.map((member) => toHoliIdentity(member.id)) ?? []

  const { data, loading } = useQuery<UsersByChatIdentitiesResponse, UsersByChatIdentitiesQueryVariables>(
    usersByChatIdentitiesQuery,
    {
      variables: {
        identities: roomMemberHoliIdentities,
        offset: 0,
        limit: roomMemberHoliIdentities.length,
      },
      skip: !roomMemberHoliIdentities.length,
    }
  )

  // might not contain holi users for every matrix ID
  // (e.g. because of data inconsistencies or because the holi user was already deleted but the Matrix user still exists)
  const roomMemberHoliUsers = data?.usersByChatIdentities.data ?? []

  const matrixIdToHoliUserRecord: Record<MatrixId, User> = roomMemberMatrixIds.reduce((acc, matrixId) => {
    return {
      ...acc,
      [matrixId]: roomMemberHoliUsers.find((holiUser) => holiUser.identity === toHoliIdentity(matrixId)),
    }
  }, {})

  return {
    matrixIdToHoliUserRecord,
    loading,
  }
}

const getChatPartner = (me: User | undefined, room: ChatRoom | null): ChatRoomMember | undefined => {
  if (!me || !room) return undefined
  const meMatrixId = '@' + me.identity + ':' + chatServerName
  return room.members.find((member) => member.id !== meMatrixId)
}

const ChatRoomView = () => {
  const { t } = useTranslation()
  const chatInitialized = useAtomValue(chatInitializedAtom)

  const [roomId = ''] = useParam('roomId')
  const [room, messages] = useRoomById(roomId)

  const { matrixIdToHoliUserRecord, loading: loadingUsers } = useMatrixIdToHoliUserRecord(room)
  const [messageText, setMessageText] = useState('')

  const { user: me } = useLoggedInUser()
  const requestMessages = useRequestRoomMessages()

  const amIRoomCreator = Boolean(room?.creator?.name && me?.identity && room.creator?.name == me?.identity)
  const chatPartner = getChatPartner(me, room)
  const chatPartnerHoliUser = chatPartner && matrixIdToHoliUserRecord[chatPartner.id]
  console.debug({ chatServerName, chatPartner, chatPartnerHoliUser, matrixIdToHoliUserRecord })
  const setScreenOptions = useSetScreenOptions()
  const ignoredUsers = useIgnoredUsers()

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => {
        if (!chatPartner || !chatPartnerHoliUser) return null
        const isUserIgnored = ignoredUsers.includes(chatPartner.id)
        const [blockLabel, blockAction] = isUserIgnored
          ? [t('chat.user.unblock', { user: chatPartnerHoliUser.fullName }), () => unignoreUser(chatPartner.id)]
          : [t('chat.user.block', { user: chatPartnerHoliUser.fullName }), () => ignoreUser(chatPartner.id)]
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
  }, [chatPartner, room?.name, setScreenOptions, t, ignoredUsers, chatPartnerHoliUser])

  useEffect(() => {
    if (room?.hasInvitation) return
    requestMessages(roomId)
  }, [requestMessages, roomId, room?.hasInvitation])

  const handleSendMessage = async () => {
    const text = messageText.trim()
    if (!text) return

    await sendMessage({ roomId, text })
    setMessageText('')
  }

  console.debug('chatInitialized', chatInitialized, 'room', room, 'loadingUsers', loadingUsers)

  // TODO: provide skeleton instead of HoliLoader
  if (!chatInitialized || !room || loadingUsers) return <HoliLoader />

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeAreaView style={styles.wrapper}>
          <View style={{ backgroundColor: colors.background20, flex: 1 }}>
            {room.hasInvitation ? (
              <ChatProfileCard roomId={roomId} user={chatPartnerHoliUser} userIsLoading={loadingUsers} />
            ) : (
              <RoomMessageList
                messages={messages}
                matrixIdToHoliUserRecord={matrixIdToHoliUserRecord}
                starter={
                  amIRoomCreator &&
                  chatPartner && (
                    <HoliBox padding={[0, 16]}>
                      <RoomMessageListStart user={chatPartnerHoliUser} />
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
