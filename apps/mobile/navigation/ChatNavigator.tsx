import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatRoomView from '@holi/core/screens/chat/ChatRoomView'
import ChatStartConversationView from '@holi/core/screens/chat/ChatStartConversationView'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'

export type ChatStackScreensList = {
  ChatRoom: undefined
  ChatStartConversation: undefined
}

const ChatStack = createNativeStackNavigator<ChatStackScreensList>()

const ChatStackNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme
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
      <ChatStack.Screen name={RouteName.ChatRoom} component={ChatRoomView} />
      <ChatStack.Screen name={RouteName.ChatStartConversation} component={ChatStartConversationView} />
    </ChatStack.Navigator>
  )
}

export default ChatStackNavigator
