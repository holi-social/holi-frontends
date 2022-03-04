import { StyleSheet, View, Text } from 'react-native'
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "./_navigationStack"

import Feed from "shared/components/Feed"



export type FeedScreenProps = NativeStackScreenProps<RootStackParamList, "Feed">

export default function FeedScreen({ navigation }: FeedScreenProps) {
  return (
    <View style={styles.container}>
      <Feed />
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
})
