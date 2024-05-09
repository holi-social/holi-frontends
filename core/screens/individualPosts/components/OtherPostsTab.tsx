import { ApolloError, OperationVariables } from '@apollo/client'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import EmptyTab from '@holi/core/components/EmptyTab'
import { DisplayErrorFunc, useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import PostsList from '@holi/core/screens/individualPosts/components/PostsList'
import { postsByUserIdQuery } from '@holi/core/screens/individualPosts/queries'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostsTabProps = {
  userId: string
  userFirstName?: string
}

const queryOptions = (errorHandler: DisplayErrorFunc, { userId }: OperationVariables): PaginationQueryHookOptions => {
  return {
    variables: { userId },
    pageSize: 10,
    queryPath: 'postsByUserId',
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error: ApolloError) => {
      errorHandler(error, 'Failed to query posts for user', {
        location: 'postsByUserIdQuery',
      })
    },
  }
}

const OtherPostsTab = ({ userId, userFirstName }: PostsTabProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { displayError } = useErrorHandling()
  const mixins = useStyleMixins()

  return (
    <View style={styles.container}>
      <Pagination
        query={postsByUserIdQuery}
        queryOptions={queryOptions(displayError, { userId })}
        fetchMoreButtonProps={{
          type: 'secondary',
          style: mixins.moreButton,
          testID: 'btn-other-posts-list-load-more',
        }}
        fetchMoreButtonLabel={t('individuals.post.loadMoreText')}
      >
        <PostsList
          emptyMessage={
            <EmptyTab
              text={t('individuals.post.emptyTitleOther', { name: userFirstName || t('user.profileView.anonymous') })}
            />
          }
          showVisibilityBadge
        />
      </Pagination>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
      paddingVertical: Spacing.xs,
      height: '100%',
    },
  })

export default OtherPostsTab
