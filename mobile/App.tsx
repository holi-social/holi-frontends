import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WithLocalSvg } from "react-native-svg";

import { getUsers, UserData } from "shared/api";
import Users from "shared/Users";
import Button from "shared/components/button";
import Counter from "shared/components/counter";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

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

function ComponentsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Components</Text>
      <Counter />
      <WithLocalSvg
        width="50"
        height="50"
        asset={require("shared/assets/img/logo/logo.svg")}
      />
    </View>
  );
}

function UsersScreen() {
  const [users, setUsers] = useState<Array<UserData>>([]);
  useEffect(() => {
    getUsers().then(setUsers);
  });
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
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
    fontSize: 24
  }
});
