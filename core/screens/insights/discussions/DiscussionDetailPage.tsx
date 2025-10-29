import { useQuery } from '@apollo/client'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { Text } from 'holi-bricks/components/text'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import Comments from '@holi/core/screens/comments/components/Comments'
import { CommentableType } from '@holi/core/screens/comments/types'
import DiscussionHeader from '@holi/core/screens/insights/discussions/DiscussionHeader'
import { discussionById, type DiscussionResponse } from '@holi/core/screens/insights/queries'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'

export type DiscussionDetailPageParams = {
  discussionId: string
  insightId: string
  commentId: string
}

const { useUUIDParam } = createParamHooks<DiscussionDetailPageParams>()

const DiscussionDetailPage = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { replaceRoute } = useRouting()
  const { requireLogin } = useSignupModal()

  const [discussionId] = useUUIDParam('discussionId')
  const [insightId] = useUUIDParam('insightId')
  const [commentId] = useUUIDParam('commentId') // if there is a commentId, open its replies by default (usually after a new comment is made)

  const styles = useMemo(() => getStyles(theme), [theme])

  const {
    data: { discussionById: discussion } = {},
    refetch,
  } = useQuery<DiscussionResponse>(discussionById, {
    variables: { discussionId },
    skip: !discussionId,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load discussion', {
        location: 'DiscussionDetailPage.discussionById',
        variables: { discussionId },
      })
    },
  })

  useOnRefresh(refetch)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackVisible: false,
      headerTitleAlign: 'center',
      navigationCustomOptions: {
        footerShown: false,
      },
      headerTitle: () => (
        <Text headingLevel="1" size="lg">
          {t('insights.discussions.pageTitle')}
        </Text>
      ),
      headerLeft: ({ tintColor }) => (
        <HeaderBackButton tintColor={tintColor} fallbackRoute={`/insights/${insightId}`} />
      ),
    })
  }, [t, setScreenOptions, insightId])

  const commentPath = `/insights/${insightId}/discussions/${discussionId}/comment`

  const onPressCreateComment = () =>
    requireLogin(() => replaceRoute(commentPath), {
      description: t('insight.discussion.comment.loginRedirect.text'),
      trackTrigger: 'COMMENT_ON_INSIGHT',
      redirectPath: commentPath,
    })

  return (
    <>
      <ScrollViewRefreshable style={styles.wrapper} contentContainerStyle={styles.wrapperContent}>
        <HoliContainer noPadding>
          {discussion ? <DiscussionHeader question={discussion.question} /> : <LoadingSkeleton />}
          {discussionId && (
            <View style={styles.commentsContainer}>
              <Comments
                commentableType={CommentableType.DISCUSSION}
                commentableId={discussionId}
                replyRoute={`/insights/${insightId}/discussions/${discussionId}/comment`}
                onPressCreateComment={onPressCreateComment}
                initialOpenThread={commentId}
              />
            </View>
          )}
        </HoliContainer>
      </ScrollViewRefreshable>

      <SafeArea edges={['bottom']}>
        <View style={styles.commentWrapper}>
          <HoliContainer flex={1}>
            <PostDetailFooter style={[styles.commentButton]} onPress={onPressCreateComment} />
          </HoliContainer>
        </View>
      </SafeArea>
    </>
  )
}

const LoadingSkeleton = () => <HoliSkeleton height={100} width={'100%'} borderRadius={0} />

const getStyles = ({ colors }: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background20,
      ...Platform.select({
        web: {
          minHeight: '100%',
          paddingTop: dimensions.topBarHeight,
          paddingBottom: dimensions.bottomBarHeight + Spacing.xl,
        },
      }),
    },
    wrapperContent: {
      paddingBottom: 64,
    },
    commentsContainer: {
      paddingHorizontal: Spacing.xs,
      paddingVertical: Spacing.sm,
      backgroundColor: colors.background10,
      borderBottomLeftRadius: Spacing.lg,
      borderBottomRightRadius: Spacing.lg,
    },
    commentWrapper: {
      backgroundColor: colors.background10,
      borderTopColor: colors.background30,
      borderTopWidth: 1,
      width: '100%',
      height: 74,
      ...Platform.select({
        web: {
          position: 'fixed',
          bottom: 0,
        },
      }),
    },
    commentButton: {
      flex: 1,
    },
  })

export default memo(DiscussionDetailPage)
