import React from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import EmptyPosts from '@holi/core/screens/individualPosts/components/EmptyPosts'
import PostsList from '@holi/core/screens/individualPosts/components/PostsList'
import { myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import Spacing from '@holi/ui/foundations/Spacing'

const MyPostsTab = () => {
  return (
    <View style={styles.container}>
      <PostsList
        emptyMessage={<EmptyPosts />}
        showVisibilityBadge
        postsQuery={myPostsQuery}
        paginationOptions={{ queryPath: 'myPosts', pageSize: 10 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
  },
})

export default MyPostsTab
