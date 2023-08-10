import { useQuery } from '@apollo/client'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useLayoutEffect, useState } from 'react'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import {
  ChatRoom,
  joinRoomAtom,
  roomAtomsRecordAtom,
  roomMessagesSubscriberAtom,
  threadsAtomsRecordAtom,
} from '@holi/chat/src/store'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import RoomMessageList from '@holi/core/screens/chat/components/RoomMessageList'
import {
  UsersByChatIdentitiesQueryVariables,
  UsersByChatIdentitiesResponse,
  usersByChatIdentitiesQuery,
} from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SendPlane } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
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
  const [roomId = ''] = useParam('roomId')
  const roomAtomsRecord = useAtomValue(roomAtomsRecordAtom)
  const roomAtom = roomAtomsRecord[roomId] ?? nullAtom
  const room = useAtomValue(roomAtom)

  const joinRoom = useSetAtom(joinRoomAtom)
  const { mxIdOrIdentityToUserRecord, loading: loadingUsers } = useIdOrIdentityToUserRecord(room)

  const threadsAtomsRecord = useAtomValue(threadsAtomsRecordAtom)
  const messagesAtom = threadsAtomsRecord[roomId] ?? nullAtom
  const messages = useAtomValue(messagesAtom) ?? []
  const [, sendMessage] = useAtom(roomMessagesSubscriberAtom)

  const [messageText, setMessageText] = useState('')
  const noMessageAvailable = !messageText.trim()

  const setScreenOptions = useSetScreenOptions()

  const headerTitle = mxIdOrIdentityToUserRecord[room?.name]?.fullName ?? ''

  useLayoutEffect(() => {
    setScreenOptions({
      title: headerTitle,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [headerTitle, room?.name, setScreenOptions])

  // TODO: provide skeleton instead of HoliLoader
  if (!room || loadingUsers) return <HoliLoader />

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeAreaView style={styles.wrapper}>
          <View style={{ backgroundColor: colors.background20, flex: 1 }}>
            {room.hasInvitation ? (
              <View style={{ flex: 1 }}>
                <HoliBox padding={[+vars.bottomBarHeight + 20, 20]}>
                  <HoliButton label={'accept Invitation'} onPress={async () => await joinRoom(roomId)}>
                    Accept Invitation
                  </HoliButton>
                </HoliBox>
              </View>
            ) : (
              <RoomMessageList messages={messages} mxIdUserRecord={mxIdOrIdentityToUserRecord} />
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
