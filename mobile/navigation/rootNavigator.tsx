import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CommunityAppScreen } from 'shared/features/community/screens'
import { CommunityFeedDetailScreen } from 'shared/features/community/screens'

import SpacesNavigator from 'mobile/navigation/spacesNavigator'

export type RootStackScreensList = {
  Spaces: undefined
  Community: undefined
  CommunityFeedDetail: {
    feedId: string
  }
}

const RootStack = createNativeStackNavigator<RootStackScreensList>()

export const RootNavigator: React.ComponentType = () => (
  <RootStack.Navigator
    initialRouteName="Spaces"
    screenOptions={{
      headerShown: false,
    }}
  >
    <RootStack.Screen name="Spaces" component={SpacesNavigator} />
    <RootStack.Screen
      name="Community"
      component={CommunityAppScreen}
      options={{
        animation: 'slide_from_bottom',
        gestureEnabled: false,
      }}
    />
    {/* modals are only correctly rendered on android when in root navigator */}
    <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: true }}>
      <RootStack.Screen name="CommunityFeedDetail" component={CommunityFeedDetailScreen} />
    </RootStack.Group>
  </RootStack.Navigator>
)
