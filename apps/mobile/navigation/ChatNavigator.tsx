import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatRoom from '@holi/core/screens/chat/ChatRoom'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type ChatStackScreensList = {
  ChatRoom: undefined
}

const ChatStack = createNativeStackNavigator<ChatStackScreensList>()

const ChatStackNavigator = () => {
  return (
    <ChatStack.Navigator
      initialRouteName={RouteName.ChatRoom}
      screenOptions={{
        header: HeaderAnimated,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.background10,
        },
      }}
    >
      <ChatStack.Screen name={RouteName.ChatRoom} component={ChatRoom} />
    </ChatStack.Navigator>
  )
}

export default ChatStackNavigator
