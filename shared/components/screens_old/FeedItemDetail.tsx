import React from 'react'
import { StyleSheet, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { NavigationStackScreensList } from 'shared/components/navigation/NavigationDrawer'
import FeedItemDetail from 'shared/components/feed/FeedItemDetail'

export type FeedItemDetailScreenProps = NativeStackScreenProps<NavigationStackScreensList, 'FeedItemDetail'>

const FeedItemDetailScreen: React.VoidFunctionComponent<FeedItemDetailScreenProps> = ({ route }) => {
  return (
    <View style={styles.container}>
      <FeedItemDetail postId={route.params.postId} />
    </View>
  )
}

export default FeedItemDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
