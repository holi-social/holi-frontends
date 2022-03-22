import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FeedScreen from 'shared/components/screens/Feed'
import FeedItemDetailScreen from 'shared/components/screens/FeedItemDetail'

const Stack = createNativeStackNavigator()

const FeedSubNavigationStack: React.VoidFunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed2" component={FeedScreen} />
      <Stack.Screen name="FeedItemDetail" component={FeedItemDetailScreen} />
    </Stack.Navigator>
  )
}

export default FeedSubNavigationStack
