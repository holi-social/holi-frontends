import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApolloProvider } from "@apollo/client";
import NavigationStack from './screens/_navigationStack'
import holiTheme from 'shared/styles/theme'
import client from "shared/graphql/client";


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
        <NavigationStack />
      </NavigationContainer>
    </ApolloProvider>
  );
}
