import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatHome from '@holi/core/screens/ChatHome'
import HeaderAnimated from '@holi/mobile/navigation/HeaderAnimated'
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
        header: HeaderAnimated,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.backgroundColorWhite,
        },
      }}
    >
      <ChatStack.Screen name="ChatHome" component={ChatHome} />
    </ChatStack.Navigator>
  )
}

export default ChatStackNavigator
