import { useQuery } from '@apollo/client'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CommentForm from '@holi/core/screens/comments/components/CommentForm'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import { CommentResponse, commentById } from '@holi/core/screens/comments/queries'
import { CommentableType } from '@holi/core/screens/comments/types'
import PostContent from '@holi/core/screens/individualPosts/components/PostContent'
import { PostQueryResponse, postQuery } from '@holi/core/screens/individualPosts/queries'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

export type PostCommentPageParams = {
  idOrSlug: string
  commentId: string
}

const { useParam } = createParamHooks<PostCommentPageParams>()

const PostCommentPage = () => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const setScreenOptions = useSetScreenOptions()
  const [idOrSlug] = useParam('idOrSlug')
  const [commentId] = useParam('commentId')
  const { replaceRoute } = useRouting()

  const { theme } = useTheme()
  const { colors } = theme

  const {
    data: { post } = {},
  } = useQuery<PostQueryResponse>(postQuery, {
    variables: { idOrSlug },
    skip: !idOrSlug,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load feed post', {
        location: 'PostDetailsPage.postQuery',
        variables: { idOrSlug },
      })
    },
  })

  const {
    data: { commentById: comment } = {},
    loading: loadingComment,
  } = useQuery<CommentResponse>(commentById, {
    variables: { commentId },
    notifyOnNetworkStatusChange: true,
    skip: !commentId,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load comment', {
        location: 'PostCommentPage.commentById',
        variables: { commentId },
      })
    },
  })

  useLayoutEffect(
    () =>
      setScreenOptions({
        title: t('comments.title'),
        headerTransparent: false,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setScreenOptions, t, colors.background10]
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
        <HoliContainer>
          <View style={styles.post}>
            <PostContent post={post} />
          </View>

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
        </HoliContainer>
      </CommentForm>
    )
  )
}

export default PostCommentPage

const styles = StyleSheet.create({
  post: {
    ...Platform.select({
      ios: {
        paddingTop: Spacing.xxs,
      },
    }),
  },
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
