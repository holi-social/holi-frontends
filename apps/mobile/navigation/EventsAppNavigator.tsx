import React from 'react'

import { createNativeStackNavigator, type NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { EventList } from '@holi-apps/events/screens/EventList'
import { type EventsHomeParams, EventsHomeScreen } from '@holi-apps/events/screens/EventsHome'
import { type EventDetailsParams, EventDetailsScreen } from '@holi-apps/events/screens/EventDetails'
import { mono } from 'holi-bricks/tokens'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { ArrowDownS } from '@holi/icons/src/generated'

export type EventsAppScreens = {
  [RouteName.EventsHomeScreen]: EventsHomeParams
  [RouteName.EventDetailsScreen]: EventDetailsParams
  [RouteName.EventList]: undefined
}

const EventsAppStack = createNativeStackNavigator<EventsAppScreens>()

const EventsAppNavigator = () => {
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
      <EventsAppStack.Screen name={RouteName.EventList} component={EventList} />
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

export default EventsAppNavigator
