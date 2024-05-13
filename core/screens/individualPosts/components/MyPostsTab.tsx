import React from 'react'
import { StyleSheet, View } from 'react-native'

import EmptyPosts from '@holi/core/screens/individualPosts/components/EmptyPosts'
import PostsList from '@holi/core/screens/individualPosts/components/PostsList'
import { myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import Spacing from '@holi/ui/foundations/Spacing'

const MyPostsTab = () => {
  return (
    <HoliContainer>
      <View style={styles.container}>
        <PostsList
          emptyMessage={<EmptyPosts />}
          showVisibilityBadge
          feedPostsQuery={myPostsQuery}
          paginationOptions={{ queryPath: 'myPosts', pageSize: 10 }}
        />
      </View>
    </HoliContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
    height: '100%',
  },
})

export default MyPostsTab
