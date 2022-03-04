import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HomeScreen from "./Home"
import ComponentsScreen from "./Components"
import UsersScreen from "./Users"
import FeedScreen from "./Feed"
import FeedItemDetailScreen from "./FeedItemDetail"

// see https://reactnavigation.org/docs/typescript/#type-checking-screens
export type RootStackParamList = {
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
