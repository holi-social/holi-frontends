import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { EventList } from '@holi-apps/events/components/EventList'

export type EventsAppScreens = {
  [RouteName.EventList]: undefined
}

const EventsAppStack = createNativeStackNavigator<EventsAppScreens>()

const EventsAppNavigator = () => {
  return (
    <EventsAppStack.Navigator
      initialRouteName={RouteName.EventList}
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTransparent: true,
      }}
    >
      <EventsAppStack.Screen name={RouteName.EventList} component={EventList} />
    </EventsAppStack.Navigator>
  )
}

export default EventsAppNavigator
