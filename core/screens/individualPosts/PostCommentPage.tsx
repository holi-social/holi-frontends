import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { isForbiddenError, isNotFoundError, logError } from '@holi/core/errors/helpers'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ContentType } from '@holi/core/queries'
import CommentForm from '@holi/core/screens/comments/components/CommentForm'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import { CommentResponse, commentById } from '@holi/core/screens/comments/queries'
import { CommentableType } from '@holi/core/screens/comments/types'
import PostContent from '@holi/core/screens/individualPosts/components/PostContent'
import { PostQueryResponse, postQuery } from '@holi/core/screens/individualPosts/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

export type PostCommentPageParams = {
  slug: string
  commentId?: string
}

const PostCommentPage = () => {
  const { useParam } = createParamHooks<PostCommentPageParams>()

  const [slug] = useParam('slug')
  const [commentId] = useParam('commentId')

  const { navigate, replaceRoute } = useRouting()
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const setScreenOptions = useSetScreenOptions()

  const { theme } = useTheme()
  const { colors } = theme

  const {
    loading,
    error,
    data: { post } = {},
  } = useQuery<PostQueryResponse>(postQuery, {
    variables: { idOrSlug: slug },
    skip: !slug,
    onError: (error) => {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load feed post', { location: 'PostCommentPage.postQuery', slug })
    },
  })

  const { data: { commentById: comment } = {}, loading: loadingComment } = useQuery<CommentResponse>(commentById, {
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
        headerStyle: { backgroundColor: colors.background10 },
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setScreenOptions, t, colors.background10]
  )

  if (loading || error || !post) {
    return <></>
  }

  if (!user) {
    navigate(`/feedPosts/${slug}`)
    return null
  }

  return (
    <CommentForm commentableId={post.id} commentableType={CommentableType.FEED_POST} user={user}>
      <PostContent post={post} />
      {loadingComment && (
        <View style={[styles.parentComment, styles.skeletonContainer]}>
          <HoliSkeleton height={Spacing.xl} width={Spacing.xl} borderRadius={24} />
          <HoliSkeleton height={Spacing['4xl']} width={'80%'} borderRadius={16} />
        </View>
      )}

      {!!comment && (
        <View style={styles.parentComment}>
          <CommentView
            comment={comment}
            commentableId={post.id}
            commentableType={CommentableType.FEED_POST}
            reportContentType={ContentType.FEED_POST_COMMENT}
          />
        </View>
      )}
    </CommentForm>
  )
}

export default withProfiler(memo(PostCommentPage), { name: 'CommentInputPage' })

const styles = StyleSheet.create({
  discussion: {
    ...Platform.select({
      ios: {
        paddingTop: Spacing.xxs,
      },
    }),
  },
  parentComment: {
    marginVertical: Spacing.xs,
    marginRight: Spacing.xs,
    marginLeft: Spacing['3xs'],
  },
  skeletonContainer: {
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
})
