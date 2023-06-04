import React, { useEffect } from 'react'

import type { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs'
import type { NavigationProp, NavigationState } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import useMxLogin from '@holi/chat/src/useMxLogin'
import ChatHome from '@holi/core/screens/ChatHome'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type ChatStackScreensList = {
  ChatHome: undefined
}

const ChatStack = createNativeStackNavigator<ChatStackScreensList>()

interface ChatScreenOptions {
  headerShown: boolean
  tabBarIcon: ({ focused }: { focused: boolean }) => JSX.Element
  tabBarLabel: 'Chat'
}

interface Props {
  navigation: NavigationProp<
    ChatStackScreensList,
    'ChatHome',
    string | undefined,
    NavigationState<ChatStackScreensList>,
    ChatScreenOptions,
    BottomTabNavigationEventMap
  >
}

const ChatStackNavigator = ({ navigation }: Props) => {
  const { handleSSORedirect } = useMxLogin()

  useEffect(() => {
    // Handle Chat Login/Registration
    // TODO: verify if we already count with a token
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      e.preventDefault()
      handleSSORedirect()
    })

    return () => unsubscribe()
  }, [navigation, handleSSORedirect])

  return (
    <ChatStack.Navigator
      initialRouteName={RouteName.ChatHome}
      screenOptions={{
        header: HeaderAnimated,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.background10,
        },
      }}
    >
      <ChatStack.Screen name={RouteName.ChatHome} component={ChatHome} />
    </ChatStack.Navigator>
  )
}

export default ChatStackNavigator
