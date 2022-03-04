import { StyleSheet, View, Text } from 'react-native'
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { NavigationStackScreensList } from "./NavigationStack"
import Feed from "shared/components/Feed"



export type FeedScreenProps = NativeStackScreenProps<NavigationStackScreensList, "Feed">

export default function FeedScreen({ navigation }: FeedScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Feed</Text>
      <Feed />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
  },
})
