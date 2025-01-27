import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatRoomView from '@holi/core/screens/chat/ChatRoomView'
import ChatStartConversationView from '@holi/core/screens/chat/ChatStartConversationView'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type ChatStackScreensList = {
  ChatRoom: undefined
  ChatStartConversation: undefined
}

const ChatStack = createNativeStackNavigator<ChatStackScreensList>()

const ChatStackNavigator = () => {
  return (
    <ChatStack.Navigator
      initialRouteName={RouteName.ChatRoom}
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: colors.black300,
        headerBackVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <ChatStack.Screen name={RouteName.ChatRoom} component={ChatRoomView} />
      <ChatStack.Screen name={RouteName.ChatStartConversation} component={ChatStartConversationView} />
    </ChatStack.Navigator>
  )
}

export default ChatStackNavigator
