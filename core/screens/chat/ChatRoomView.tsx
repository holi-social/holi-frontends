import { useQuery } from '@apollo/client'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import {
  ChatRoom,
  joinRoomAtom,
  messagesAtomsRecordAtom,
  roomMessagesSubscriberAtom,
  selectRoomByIdAtom,
  selectedRoomAtom,
} from '@holi/chat/src/store'
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
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SendPlane } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliCardBoard from '@holi/ui/components/organisms/HoliCardBoard'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type ChatRoomPageParams = {
  roomId: string
}

const nullAtom = atom(null)

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
  const mxIdOrIdentityToUserRecord: Record<string, User> = users.reduce((acc, user) => {
    const mxUserId = room?.members.find((member) => member.name === user.identity)?.id
    if (mxUserId) {
      return { ...acc, [mxUserId]: user, [user.identity]: user }
    }
    return acc
  }, {})

  return {
    mxIdOrIdentityToUserRecord,
    loading,
  }
}

const ChatRoomView = () => {
  const { t } = useTranslation()

  const [roomId = ''] = useParam('roomId')
  const room = useAtomValue(selectedRoomAtom)
  const selectRoomById = useSetAtom(selectRoomByIdAtom)
  const joinRoom = useSetAtom(joinRoomAtom)
  const { mxIdOrIdentityToUserRecord, loading: loadingUsers } = useIdOrIdentityToUserRecord(room)

  // Messages
  const threadsAtomsRecord = useAtomValue(messagesAtomsRecordAtom)
  // TODO: This should be an room atom selection handled by the store
  const messagesAtom = threadsAtomsRecord[roomId] ?? nullAtom
  const messages = useAtomValue(messagesAtom) ?? []
  const [, sendMessage] = useAtom(roomMessagesSubscriberAtom)

  const [messageText, setMessageText] = useState('')
  const noMessageAvailable = !messageText.trim()

  const { user: me } = useLoggedInUser()
  const amIRoomCreator = room?.creator?.name && me?.identity && room.creator?.name == me?.identity
  const roomUser = mxIdOrIdentityToUserRecord[room?.name ?? '']

  const setScreenOptions = useSetScreenOptions()

  useEffect(() => {
    setScreenOptions({
      headerTitle: () =>
        roomUser ? (
          <HoliLink label={t('user.visitProfile', { name: roomUser.fullName })} href={`/profile/${roomUser.id}`}>
            <View style={styles.headerTitle}>
              <HoliAvatar
                imageSrc={roomUser.avatar}
                imageBlurhash={roomUser.avatarBlurhash}
                label={roomUser.fullName}
                initials={roomUser.avatarLabel}
                defaultColor={roomUser.avatarDefaultColor}
                size="micro"
              />
              <HoliText bold>{roomUser.fullName}</HoliText>
            </View>
          </HoliLink>
        ) : null,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [roomUser, room?.name, setScreenOptions, t])

  // Select the room in the case the room was open through a direct link or a reload.
  useEffect(() => {
    if (roomId.length < 1 || room) return
    selectRoomById(roomId)
  }, [room, roomId, selectRoomById])

  // TODO: provide skeleton instead of HoliLoader
  if (!room || loadingUsers) return <HoliLoader />

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeAreaView style={styles.wrapper}>
          <View style={{ backgroundColor: colors.background20, flex: 1 }}>
            {room.hasInvitation ? (
              <View style={styles.userCardContainer}>
                <HoliCardBoard>
                  <HoliButton label={'accept Invitation'} onPress={async () => await joinRoom(roomId)}>
                    Accept Invitation
                  </HoliButton>
                </HoliCardBoard>
              </View>
            ) : (
              <RoomMessageList
                messages={messages}
                mxIdUserRecord={mxIdOrIdentityToUserRecord}
                starter={
                  amIRoomCreator &&
                  roomUser && (
                    <HoliBox padding={[0, 16]}>
                      <RoomMessageListStart user={roomUser} />
                    </HoliBox>
                  )
                }
              />
            )}

            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderBottomColor: colors.white100,
                borderWidth: 2,
                borderColor: colors.background30,
                backgroundColor: colors.white100,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <HoliTextInput
                // TODO: provide correct accessibilityLabel prop
                accessibilityLabel="Message"
                testID={'chat-message-input'}
                value={messageText}
                onChange={setMessageText}
                style={{
                  backgroundColor: colors.white100,
                  flexShrink: 1,
                }}
                inputStyle={{
                  borderWidth: 0,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                }}
                maxNoOfVisibleLines={5}
              />

              <HoliButton
                label=""
                disabled={noMessageAvailable}
                onPress={async () => {
                  const text = messageText.trim()
                  if (!text) return

                  await sendMessage({ roomId, text })
                  setMessageText('')
                }}
                inline
                style={{ paddingVertical: 8, paddingHorizontal: 8, alignSelf: 'flex-end' }}
              >
                <HoliIcon icon={SendPlane} size={20} color={colors.foreground30} />
              </HoliButton>
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
  userCardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: vars.bottomBarHeight,
  },
  listFooterSpacer: {
    height: vars.topBarHeight,
  },
})
