import { ApolloError } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { DisplayErrorFunc, useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import EmptyPosts from '@holi/core/screens/individualPosts/components/EmptyPosts'
import PostsList from '@holi/core/screens/individualPosts/components/PostsList'
import { myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import Spacing from '@holi/ui/foundations/Spacing'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const queryOptions = (errorHandler: DisplayErrorFunc): PaginationQueryHookOptions => {
  return {
    pageSize: 10,
    queryPath: 'myPosts',
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error: ApolloError) => {
      errorHandler(error, 'Failed to query my posts', {
        location: 'myPostsQuery',
      })
    },
  }
}

const MyPostsTab = () => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const mixins = useStyleMixins()

  return (
    <View style={styles.container}>
      <Pagination
        query={myPostsQuery}
        queryOptions={queryOptions(displayError)}
        fetchMoreButtonProps={{
          type: 'secondary',
          style: mixins.moreButton,
        }}
        fetchMoreButtonLabel={t('individuals.post.loadMoreText')}
      >
        <PostsList emptyMessage={<EmptyPosts />} showVisibilityBadge />
      </Pagination>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
    height: '100%',
  },
})

export default MyPostsTab
