import React, { useLayoutEffect } from 'react'
import { Platform, View } from 'react-native'
import { SafeAreaView } from 'react-native'
import { StyleSheet } from 'react-native'

import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import RoomMessageList from '@holi/core/screens/chat/components/RoomMessageList'
import { chatRoomListSeed } from '@holi/core/screens/chat/components/seed'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParam<ChatRoomPageParams>()

const ChatRoom = () => {
  // TODO: use real data
  const [roomId = ''] = useParam('roomId')
  const room = chatRoomListSeed.find(({ id }) => roomId === id)

  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      title: room?.user.fullName,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [room?.user.fullName, setScreenOptions])

  if (!room) return null

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeAreaView style={styles.wrapper}>
          <View style={{ backgroundColor: colors.background20, flex: 1 }}>
            <RoomMessageList room={room} />

            <HoliTextInput
              accessibilityLabel="Message"
              style={{ backgroundColor: colors.background20 }}
              inputStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderBottomColor: colors.white100,
              }}
              maxNoOfVisibleLines={5}
            />
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
