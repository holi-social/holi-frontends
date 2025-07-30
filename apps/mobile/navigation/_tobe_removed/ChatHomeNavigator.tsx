import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatHome from '@holi/core/screens/chat/ChatHome'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'

export type ChatStackScreensList = {
  ChatHome: undefined
}

const ChatStack = createNativeStackNavigator<ChatStackScreensList>()

const ChatHomeStackNavigator = () => {
  return (
    <ChatStack.Navigator
      initialRouteName={RouteName.ChatHome}
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: colors.black300,
        headerTitle: ({ tintColor, children }) => (
          <HeaderTitle size="large" tintColor={tintColor}>
            {children}
          </HeaderTitle>
        ),
      }}
    >
      <ChatStack.Screen name={RouteName.ChatHome} component={ChatHome} />
    </ChatStack.Navigator>
  )
}

export default ChatHomeStackNavigator
