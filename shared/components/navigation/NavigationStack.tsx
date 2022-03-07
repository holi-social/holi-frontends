import { Text } from 'react-native'
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HomeScreen from "shared/components/screens/Home"
import ComponentsScreen from "shared/components/screens/Components"
import UsersScreen from "shared/components/screens/Users"
import FeedScreen from "shared/components/screens/Feed"
import FeedItemDetailScreen from "shared/components/screens/FeedItemDetail"

// see https://reactnavigation.org/docs/typescript/#type-checking-screens
export type NavigationStackScreensList = {
  Home: undefined;
  Components: undefined;
  Users: undefined;
  Feed: undefined;
  FeedItemDetail: { postId: string };
}

const Stack = createNativeStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Text>hello text</Text>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen name="Components" component={ComponentsScreen} />
      <Stack.Screen name="Users" component={UsersScreen} />
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="FeedItemDetail" component={FeedItemDetailScreen} />
    </Stack.Navigator>
  )
}
