// import React from 'react'

// import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import { RouteName } from '@holi/mobile/navigation/routeName'

// import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'
// import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
// import { ArrowDownS } from '@holi/icons/src/generated'
// import { mono } from 'holi-bricks/tokens'
// import { type EventsHomeParams, EventsHomeScreen } from '@holi-apps/events/screens/EventsHome'
// import { type EventDetailsParams, EventDetailsScreen } from '@holi-apps/events/screens/EventDetails'
// import { EventList } from '@holi-apps/events/components/EventList'

// export type EventsAppStack = {
//   [RouteName.EventsHomeScreen]: EventsHomeParams
//   [RouteName.EventDetailsScreen]: EventDetailsParams
//   [RouteName.EventList]: undefined
// }

// const EventsAppStack = createNativeStackNavigator<EventsAppStack>()

// export const EventsAppNavigator = () => {
//   const eventsHomeOptions: NativeStackNavigationOptions = {
//     headerBackVisible: false,
//     headerTitleAlign: 'center',
//     headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
//   }

//   return (
//     <EventsAppStack.Navigator
//       initialRouteName={RouteName.EventsHomeScreen}
//       screenOptions={{
//         headerShown: true,
//         headerTintColor: mono['800'],
//         headerShadowVisible: false,
//         headerLeft: () => <HeaderBackButton icon={ArrowDownS} />,
//         headerTitle: '', // prevent showing the technical name of the screen on initial render
//       }}
//     >
//       <EventsAppStack.Screen name={RouteName.EventList} component={EventList} />
//       <EventsAppStack.Screen
//         name={RouteName.EventsHomeScreen}
//         options={eventsHomeOptions}
//         component={EventsHomeScreen}
//       />

//       <EventsAppStack.Screen
//         name={RouteName.EventDetailsScreen}
//         options={eventsHomeOptions}
//         component={EventDetailsScreen}
//       />
//     </EventsAppStack.Navigator>
//   )
// }
