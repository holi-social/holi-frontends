import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApolloProvider } from "@apollo/client";

import holiTheme from 'shared/styles/theme'
import client from "shared/graphql/client";

import HomeScreen from "./screens/Home"
import ComponentsScreen from "./screens/Components"
import UsersScreen from "./screens/Users"
import FeedScreen from "./screens/Feed"


// see https://reactnavigation.org/docs/typescript/#type-checking-screens
export type RootStackParamList = {
  Home: undefined;
  Components: undefined;
  Users: undefined;
  Feed: undefined;
};


const Stack = createNativeStackNavigator();

const globalTheme = {
  ...DefaultTheme,
  ...holiTheme,
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer theme={globalTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Home" }}
          />
          <Stack.Screen name="Components" component={ComponentsScreen} />
          <Stack.Screen name="Users" component={UsersScreen} />
          <Stack.Screen name="Feed" component={FeedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
