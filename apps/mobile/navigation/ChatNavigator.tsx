import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderLeft from '@holi/core/navigation/components/HeaderLeft'
import HeaderRight from '@holi/core/navigation/components/HeaderRight'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import ChatHome from '@holi/core/screens/ChatHome'
import { colors } from '@holi/ui/styles/globalVars'

export type ChatStackScreensList = {
  ChatHome: undefined
}

export const CenterElement = () => <HeaderTitle style={{ paddingTop: 5 }} />
export const LeftElement = () => <HeaderLeft style={{ paddingHorizontal: 0, marginLeft: 5 }} />
export const RightElement = () => (
  <HeaderRight
    style={{
      paddingHorizontal: 0,
      marginRight: 5,
    }}
  />
)

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
      <ChatStack.Screen
        name="ChatHome"
        component={ChatHome}
        options={{
          headerBackTitleVisible: true,
          headerBackVisible: true,
          headerTitle: CenterElement,
          headerLeft: LeftElement,
          headerRight: RightElement,
        }}
      />
    </ChatStack.Navigator>
  )
}

export default ChatStackNavigator
