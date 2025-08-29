import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import EmptyTab from '@holi/core/components/EmptyTab'
import PostsList from '@holi/core/screens/individualPosts/components/PostsList'
import { postsByUserIdQuery } from '@holi/core/screens/individualPosts/queries'
import Spacing from '@holi/ui/foundations/Spacing'

export type PostsTabProps = {
  userId: string
  userFirstName?: string
}

const OtherPostsTab = ({ userId, userFirstName }: PostsTabProps) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <PostsList
        emptyMessage={
          <EmptyTab
            text={t('individuals.post.emptyTitleOther', { name: userFirstName || t('user.profileView.anonymous') })}
          />
        }
        postsQuery={postsByUserIdQuery}
        paginationOptions={{ variables: { userId }, queryPath: 'postsByUserId', pageSize: 10 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
  },
})

export default OtherPostsTab
