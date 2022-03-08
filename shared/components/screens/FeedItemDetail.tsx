import { StyleSheet, View, Text } from 'react-native'
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { NavigationStackScreensList } from "shared/components/navigation/NavigationDrawer"


export type FeedItemDetailScreenProps = NativeStackScreenProps<NavigationStackScreensList, "FeedItemDetail">

export default function FeedItemDetailScreen({ navigation, route }: FeedItemDetailScreenProps) {
  return (
    <View style={styles.container}>
      <Text>{route.params.postId}</Text>
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
