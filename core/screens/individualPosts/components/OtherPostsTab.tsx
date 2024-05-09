import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import EmptyTab from '@holi/core/components/EmptyTab'
import PostsList from '@holi/core/screens/individualPosts/components/PostsList'
import { postsByUserIdQuery } from '@holi/core/screens/individualPosts/queries'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import Spacing from '@holi/ui/foundations/Spacing'

export type PostsTabProps = {
  userId: string
  userFirstName?: string
}

const OtherPostsTab = ({ userId, userFirstName }: PostsTabProps) => {
  const { t } = useTranslation()

  return (
    <HoliContainer>
      <View style={styles.container}>
        <PostsList
          emptyMessage={
            <EmptyTab
              text={t('individuals.post.emptyTitleOther', { name: userFirstName || t('user.profileView.anonymous') })}
            />
          }
          feedPostsQuery={postsByUserIdQuery}
          paginationOptions={{ variables: { userId }, queryPath: 'postsByUserId', pageSize: 10 }}
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

export default OtherPostsTab
