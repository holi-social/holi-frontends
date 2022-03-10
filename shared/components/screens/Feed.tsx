import React from 'react'
import { StyleSheet, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { NavigationStackScreensList } from 'shared/components/navigation/NavigationDrawer'
import Feed from 'shared/components/feed/Feed'

export type FeedScreenProps = NativeStackScreenProps<
  NavigationStackScreensList,
  'Feed'
>

const FeedScreen: React.VoidFunctionComponent<FeedScreenProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <Feed
        onItemPressed={(post) =>
          navigation.navigate('FeedItemDetail', { postId: post.id })
        }
      />
    </View>
  )
}

export default FeedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
