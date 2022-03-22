import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CommunityApp } from 'shared/features/community/screens/app'
import { FeedDetailScreen } from 'shared/features/community/screens/details'

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
      component={CommunityApp}
      options={{
        animation: 'slide_from_bottom',
        gestureEnabled: false,
      }}
    />
    {/* modals are only correctly rendered on android when in root navigator */}
    <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: true }}>
      <RootStack.Screen name="CommunityFeedDetail" component={FeedDetailScreen} />
    </RootStack.Group>
  </RootStack.Navigator>
)
