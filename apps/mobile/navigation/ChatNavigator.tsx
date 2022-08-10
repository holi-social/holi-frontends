import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatHome from '@holi/core/screens/ChatHome'
import { colors } from '@holi/ui/styles/globalVars'

export type ChatStackScreensList = {
  ChatHome: undefined
}

const ChatStack = createNativeStackNavigator<ChatStackScreensList>()
const ChatStackNavigator: React.VFC = () => {
  return (
    <ChatStack.Navigator
      initialRouteName="ChatHome"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.backgroundColorWhite,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <ChatStack.Screen name="ChatHome" component={ChatHome} />
    </ChatStack.Navigator>
  )
}

export default ChatStackNavigator
