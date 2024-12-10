import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatHome from '@holi/core/screens/chat/ChatHome'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type ChatStackScreensList = {
  ChatHome: undefined
}

const ChatStack = createNativeStackNavigator<ChatStackScreensList>()

const ChatHomeStackNavigator = () => {
  return (
    <ChatStack.Navigator
      initialRouteName={RouteName.ChatHome}
      screenOptions={{ headerShown: true, headerShadowVisible: false }}
    >
      <ChatStack.Screen name={RouteName.ChatHome} component={ChatHome} />
    </ChatStack.Navigator>
  )
}

export default ChatHomeStackNavigator
