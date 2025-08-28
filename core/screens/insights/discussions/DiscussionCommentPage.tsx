import { useQuery } from '@apollo/client'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CommentForm from '@holi/core/screens/comments/components/CommentForm'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import { type CommentResponse, commentById } from '@holi/core/screens/comments/queries'
import { CommentableType } from '@holi/core/screens/comments/types'
import DiscussionHeader from '@holi/core/screens/insights/discussions/DiscussionHeader'
import { type DiscussionResponse, discussionById } from '@holi/core/screens/insights/queries'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

export type DiscussionCommentPageParams = {
  discussionId: string
  commentId: string
  insightId: string
}

const { useUUIDParam } = createParamHooks<DiscussionCommentPageParams>()

const DiscussionCommentPage = () => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const setScreenOptions = useSetScreenOptions()
  const [discussionId] = useUUIDParam('discussionId')
  const [insightId] = useUUIDParam('insightId')
  const [commentId] = useUUIDParam('commentId')
  const { replaceRoute } = useRouting()
  const { theme } = useTheme()

  const {
    data: { discussionById: discussion } = {},
  } = useQuery<DiscussionResponse>(discussionById, {
    variables: { discussionId },
    notifyOnNetworkStatusChange: true,
    skip: !discussionId,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load discussion', {
        location: 'DiscussionCommentPage.discussionById',
        variables: { discussionId },
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
        location: 'DiscussionCommentPage.commentById',
        variables: { commentId },
      })
    },
  })

  useLayoutEffect(
    () =>
      setScreenOptions({
        title: t('comments.title'),
        navigationCustomOptions: {
          footerShown: false,
        },
        headerLeft: () => (
          <HeaderBackButton onPress={() => replaceRoute(`/insights/${insightId}/discussions/${discussionId}`)} />
        ),
      }),
    [setScreenOptions, t, theme.colors.background10, insightId, discussionId, replaceRoute]
  )

  return (
    discussion &&
    user && (
      <CommentForm
        commentableId={discussion.id}
        commentableType={CommentableType.DISCUSSION}
        user={user}
        redirectRoute={`/insights/${insightId}/discussions/${discussion.id}${
          comment ? '?commentId=' + comment.id : ''
        }`}
        parentComment={comment}
      >
        <View style={styles.discussion}>
          <DiscussionHeader question={discussion.question} />
        </View>

        {loadingComment && (
          <View style={[styles.parentComment, styles.skeletonContainer]}>
            <HoliSkeleton height={Spacing.xl} width={Spacing.xl} borderRadius={24} />
            <HoliSkeleton height={Spacing['4xl']} width={'80%'} borderRadius={16} />
          </View>
        )}

        {!!comment && (
          <View style={styles.parentComment}>
            <CommentView comment={comment} commentableId={discussion.id} commentableType={CommentableType.DISCUSSION} />
          </View>
        )}
      </CommentForm>
    )
  )
}

export default DiscussionCommentPage

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
