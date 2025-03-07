import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { EventDetailsScreen, type EventDetailsParams } from '@holi/core/features/events/screens/EventDetails'

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { ArrowDownS } from '@holi/icons/src/generated'
import { EventsHomeScreen, type EventsHomeParams } from '@holi/core/features/events/screens/EventsHome'
import { mono } from 'holi-bricks/tokens'

export type EventsAppStack = {
  [RouteName.EventsHomeScreen]: EventsHomeParams
  [RouteName.EventDetailsScreen]: EventDetailsParams
}

const EventsAppStack = createNativeStackNavigator<EventsAppStack>()

export const EventsAppNavigator = () => {
  const eventsHomeOptions: NativeStackNavigationOptions = {
    headerBackVisible: false,
    headerTitleAlign: 'center',
    headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
  }

  return (
    <EventsAppStack.Navigator
      initialRouteName={RouteName.EventsHomeScreen}
      screenOptions={{
        headerShown: true,
        headerTintColor: mono['800'],
        headerShadowVisible: false,
        headerLeft: () => <HeaderBackButton icon={ArrowDownS} />,
        headerTitle: '', // prevent showing the technical name of the screen on initial render
      }}
    >
      <EventsAppStack.Screen
        name={RouteName.EventsHomeScreen}
        options={eventsHomeOptions}
        component={EventsHomeScreen}
      />

      <EventsAppStack.Screen
        name={RouteName.EventDetailsScreen}
        options={eventsHomeOptions}
        component={EventDetailsScreen}
      />
    </EventsAppStack.Navigator>
  )
}
