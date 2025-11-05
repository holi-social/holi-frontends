import { useQuery } from '@apollo/client/react'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CommentForm from '@holi/core/screens/comments/components/CommentForm'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import { commentById, type CommentResponse } from '@holi/core/screens/comments/queries'
import { CommentableType } from '@holi/core/screens/comments/types'
import PostContent from '@holi/core/screens/individualPosts/components/PostContent'
import { postQuery, type PostQueryResponse } from '@holi/core/screens/individualPosts/queries'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useApolloNotFoundErrorHandling } from '@holi/core/hooks/useApolloNotFoundErrorHandling'

export type PostCommentPageParams = {
  idOrSlug: string
  commentId: string
}

const { useParam, useUUIDParam } = createParamHooks<PostCommentPageParams>()

const PostCommentPage = () => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const setScreenOptions = useSetScreenOptions()
  const [idOrSlug] = useParam('idOrSlug')
  const [commentId] = useUUIDParam('commentId')

  const { theme } = useTheme()
  const { colors } = theme

  const {
    data: { post } = {},
    error: loadPostError,
  } = useQuery<PostQueryResponse>(postQuery, {
    variables: { idOrSlug },
    skip: !idOrSlug,
  })
  useApolloNotFoundErrorHandling(loadPostError, 'Failed to load feed post', {
    location: 'PostDetailsPage.postQuery',
    variables: { idOrSlug },
  })

  const {
    data: { commentById: comment } = {},
    loading: loadingComment,
    error: loadCommentError,
  } = useQuery<CommentResponse>(commentById, {
    variables: { commentId },
    notifyOnNetworkStatusChange: true,
    skip: !commentId,
  })
  useApolloNotFoundErrorHandling(loadCommentError, 'Failed to load comment', {
    location: 'PostCommentPage.commentById',
    variables: { commentId },
  })

  useLayoutEffect(
    () =>
      setScreenOptions({
        title: t('comments.title'),
        navigationCustomOptions: {
          footerShown: false,
        },
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      }),
    [setScreenOptions, t, colors.background10, theme.colors.black300]
  )

  return (
    post &&
    user && (
      <CommentForm
        commentableId={post.id}
        commentableType={CommentableType.FEED_POST}
        user={user}
        redirectRoute={`/feed-posts/${idOrSlug}${comment ? '?commentId=' + comment.id : ''}`}
        parentComment={comment}
      >
        <PostContent post={post} />

        {loadingComment && (
          <View style={[styles.parentComment, styles.skeletonContainer]}>
            <HoliSkeleton height={Spacing.xl} width={Spacing.xl} borderRadius={24} />
            <HoliSkeleton height={Spacing['4xl']} width={'80%'} borderRadius={16} />
          </View>
        )}

        {!!comment && (
          <View style={styles.parentComment}>
            <CommentView comment={comment} commentableId={post.id} commentableType={CommentableType.FEED_POST} />
          </View>
        )}
      </CommentForm>
    )
  )
}

export default PostCommentPage

const styles = StyleSheet.create({
  parentComment: {
    marginVertical: Spacing.xs,
    marginRight: Spacing.xs,
    marginLeft: -Spacing['3xs'],
  },
  skeletonContainer: {
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
})
