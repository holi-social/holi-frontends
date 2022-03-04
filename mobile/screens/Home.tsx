import { StyleSheet, View, Text } from 'react-native'
import { StatusBar } from "expo-status-bar"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "./NavigationStack"
import Button from 'shared/components/ui/button'
import Holicon from 'shared/components/ui/holicon'



export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home <Holicon icon="person" size={20} color="#0f0" /></Text>
      <Button text="Components" onPress={() => navigation.navigate("Components")} />
      <Button text="Users" onPress={() => navigation.navigate("Users")} />
      <Button text="Feed" onPress={() => navigation.navigate("Feed")} />
      <StatusBar style="auto" />
    </View>
  )
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
})
