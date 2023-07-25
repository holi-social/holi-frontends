import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Platform, View } from 'react-native'
import { SafeAreaView } from 'react-native'
import { StyleSheet } from 'react-native'

import {
  joinRoomAtom,
  roomAtomsRecordAtom,
  roomMessagesSubscriberAtom,
  selectRoomAtom,
  threadsAtomsRecordAtom,
  useSubscribeToRoomAndMessageUpdates,
} from '@holi/chat/src/store'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import RoomMessageList from '@holi/core/screens/chat/components/RoomMessageList'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SendPlane } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type ChatRoomPageParams = {
  roomId: string
}

const nullAtom = atom(null)

const { useParam } = createParam<ChatRoomPageParams>()

const ChatRoom = () => {
  useSubscribeToRoomAndMessageUpdates()

  const [roomId = ''] = useParam('roomId')
  const roomAtomsRecord = useAtomValue(roomAtomsRecordAtom)
  const roomAtom = roomAtomsRecord[roomId] ?? nullAtom
  const room = useAtomValue(roomAtom)

  const joinRoom = useSetAtom(joinRoomAtom)
  const selectRoom = useSetAtom(selectRoomAtom)

  const threadsAtomsRecord = useAtomValue(threadsAtomsRecordAtom)
  const messagesAtom = threadsAtomsRecord[roomId] ?? nullAtom
  const messages = useAtomValue(messagesAtom) ?? []
  const [, sendMessage] = useAtom(roomMessagesSubscriberAtom)

  const [messageText, setMessageText] = useState('')
  const noMessageAvailable = !messageText.trim()

  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      title: room?.name,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [room?.name, setScreenOptions])

  useEffect(() => {
    if (room) {
      selectRoom(roomAtom)
    }
  }, [room, roomAtom, selectRoom])

  if (!room) return null

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeAreaView style={styles.wrapper}>
          <View style={{ backgroundColor: colors.background20, flex: 1 }}>
            {room.hasInvitation ? (
              <View style={{ flex: 1 }}>
                <HoliBox padding={[+vars.bottomBarHeight + 20, 20]}>
                  <HoliButton
                    label={'accept Invitation'}
                    onPress={async () => await joinRoom({ id: roomId, hasInvitation: false })}
                  >
                    Accept Invitation
                  </HoliButton>
                </HoliBox>
              </View>
            ) : (
              <RoomMessageList messages={messages} />
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

export default ChatRoom

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
