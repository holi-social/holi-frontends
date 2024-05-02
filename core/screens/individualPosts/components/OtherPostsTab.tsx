import { useQuery } from '@apollo/client'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import PostCard from '@holi/core/screens/individualPosts/components/PostCard'
import { PostsByUserIdQueryResponse, postsByUserIdQuery } from '@holi/core/screens/individualPosts/queries'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type PostsTabProps = {
  userId: string
  userFirstName?: string
}

const OtherPostsTab = ({ userId, userFirstName }: PostsTabProps) => {
  const { t } = useTranslation()

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { data: { postsByUserId } = {}, loading } = useQuery<PostsByUserIdQueryResponse>(postsByUserIdQuery, {
    variables: { userId },
    onError: (error) => logError(error, 'Failed to load posts for user', { location: 'PostsTab.postQuery' }),
  })
  const posts = postsByUserId?.data || []

  return (
    <View style={styles.container}>
      <HoliContainer gap={Spacing.xxs}>
        {loading ? (
          <LoadingSkeleton />
        ) : posts.length == 0 ? (
          <HoliText>
            {t('individuals.post.emptyTitleOther', { name: userFirstName || t('user.profileView.anonymous') })}
          </HoliText>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </HoliContainer>
    </View>
  )
}

const LoadingSkeleton = () => <HoliSkeleton height={60} width="100%" borderRadius={20} />

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
      paddingVertical: Spacing.xs,
      height: '100%',
    },
  })

export default OtherPostsTab
