import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination, usePaginationContext } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import PostCard from '@holi/core/screens/individualPosts/components/PostCard'
import { postsByUserIdQuery } from '@holi/core/screens/individualPosts/queries'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostsTabProps = {
  userId: string
  userFirstName?: string
}

const OtherPostsList = ({ userFirstName }: { userFirstName?: string }) => {
  const { t } = useTranslation()
  const { loading, data: posts, totalResults } = usePaginationContext<FeedPost>()

  return (
    <HoliContainer gap={Spacing.xxs}>
      {loading ? (
        <LoadingSkeleton />
      ) : totalResults === 0 ? (
        <HoliText color="gray300">
          {t('individuals.post.emptyTitleOther', { name: userFirstName || t('user.profileView.anonymous') })}
        </HoliText>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </HoliContainer>
  )
}

const OtherPostsTab = ({ userId, userFirstName }: PostsTabProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { displayError } = useErrorHandling()
  const mixins = useStyleMixins()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: 10,
    queryPath: 'postsByUserId',
    variables: { userId },
    onError: (error) => {
      displayError(error, 'Failed to query posts for user', {
        location: 'postsByUserIdQuery',
      })
    },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
  }
  return (
    <View style={styles.container}>
      <Pagination
        query={postsByUserIdQuery}
        queryOptions={queryOptions}
        fetchMoreButtonProps={{
          type: 'secondary',
          style: mixins.moreButton,
          testID: 'btn-other-posts-list-load-more',
        }}
        fetchMoreButtonLabel={t('individuals.post.loadMoreText')}
      >
        <OtherPostsList userFirstName={userFirstName} />
      </Pagination>
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
