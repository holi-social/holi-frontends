import { StyleSheet, View, Text } from 'react-native'
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "./_navigationStack"
import FeedItemDetail from "shared/components/feed/FeedItemDetail"

export type FeedItemDetailScreenProps = NativeStackScreenProps<RootStackParamList, "FeedItemDetail">

export default function FeedItemDetailScreen({ navigation, route }: FeedItemDetailScreenProps) {
  return (
    <View style={styles.container}>
      <FeedItemDetail postId={route.params.postId} />
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
