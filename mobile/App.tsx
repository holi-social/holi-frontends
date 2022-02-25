import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ApolloProvider } from "@apollo/client";

import holiTheme from 'shared/data/theme'

import { getUsers, UserData } from "shared/api";
import Users from "shared/components/Users";
import Button from "shared/components/button";
import Counter from "shared/components/counter";
import SharedImage from "shared/components/sharedImage";
import Feed from "shared/components/Feed";
import client from "shared/graphql/client";



// see https://reactnavigation.org/docs/typescript/#type-checking-screens
type RootStackParamList = {
  Home: undefined;
  Components: undefined;
  Users: undefined;
  Feed: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>
      <Button text="Components" onPress={() => navigation.navigate("Components")} />
      <Button text="Users" onPress={() => navigation.navigate("Users")} />
      <Button text="Feed" onPress={() => navigation.navigate("Feed")} />

      <StatusBar style="auto" />
    </View>
  );
}


import ImportedSvg from 'shared/assets/img/logo/logo.svg'

function ComponentsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Components</Text>

      <Counter />

      <SharedImage imageFile={require('shared/assets/img/logo/Logo_img.png')} style={{ width: 30, height: 30 }} />
      <SharedImage imageFile={ImportedSvg} isSvg={true} style={{ width: 50, height: 50 }} />

      <Button text="hello" onPress={() => console.log('hello')} />
      <Button text="hello with margin" style={{marginTop: 20}} />
    </View>
  );
}

function UsersScreen() {
  const [users, setUsers] = useState<Array<UserData>>([]);
  useEffect(() => {
    getUsers().then(setUsers);
    return () => {}
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Users</Text>
      <Users users={users} />
    </View>
  );
}

function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Feed</Text>
      <Feed />
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
  },
});
