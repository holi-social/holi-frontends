import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatHome from '@holi/core/screens/ChatHome'
import { useTheme } from '@holi/ui/styles/theme/theme'

export type ChatStackScreensList = {
  ChatHome: undefined
}

const ChatStack = createNativeStackNavigator<ChatStackScreensList>()
const ChatStackNavigator: React.VFC = () => {
  const { theme } = useTheme()
  return (
    <ChatStack.Navigator
      initialRouteName="ChatHome"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.backgroundColorWhite,
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
