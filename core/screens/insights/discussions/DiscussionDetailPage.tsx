import { useQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import Comments from '@holi/core/screens/comments/components/Comments'
import { CommentableType } from '@holi/core/screens/comments/types'
import DiscussionHeader from '@holi/core/screens/insights/discussions/DiscussionHeader'
import { DiscussionResponse, discussionById } from '@holi/core/screens/insights/queries'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type DiscussionDetailPageParams = {
  discussionId: string
  insightId: string
  commentId: string
}

const { useParam } = createParamHooks<DiscussionDetailPageParams>()

const DiscussionDetailPage = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { replaceRoute, navigate } = useRouting()
  const { isLoggedIn } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const insets = useSafeAreaInsets()

  const [discussionId] = useParam('discussionId')
  const [insightId] = useParam('insightId')
  const [commentId] = useParam('commentId') // if there is a commentId, open its replies by default (usually after a new comment is made)

  const styles = useMemo(() => getStyles(theme, insets), [theme, insets])

  const { data: { discussionById: discussion } = {}, refetch } = useQuery<DiscussionResponse>(discussionById, {
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

  const { refreshing, onRefresh } = useOnRefresh(refetch)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: theme.colors.background10 },
      navigationCustomOptions: {
        footerShown: false,
      },
      headerTitle: ({ tintColor }) => (
        <HeaderTitle tintColor={tintColor}>{t('insights.discussions.pageTitle')}</HeaderTitle>
      ),
      headerLeft: () => (
        <HoliButton
          onPress={() => navigate(`/insights/${insightId}`)}
          transparent
          label={t('navigation.headerLeft.back')}
        >
          <HoliIcon icon={ArrowLeft} />
        </HoliButton>
      ),
    })
  }, [theme.colors.background10, t, setScreenOptions, navigate, insightId])

  const onPressCreateComment = () =>
    isLoggedIn
      ? navigate(`/insights/${insightId}/discussions/${discussionId}/comment`)
      : openLoginModal({
          description: t('comments.loginRedirect.text'),
        })

  return (
    <>
      <StatusBar backgroundColor={theme.colors.background10} style={theme.dark ? 'light' : 'dark'} />

      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        style={styles.wrapper}
        headerOverlap
        scrollEnabled={false}
        scrollable={false}
        contentStyle={styles.wrapperContent}
      >
        <HoliContainer noPadding>
          <ScrollView style={styles.scrollView}>
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
          </ScrollView>
        </HoliContainer>
      </ScrollHeaderLayout.Refreshable>

      <SafeAreaView>
        <View style={styles.commentWrapper}>
          <HoliContainer flex={1}>
            <PostDetailFooter style={[styles.commentButton]} onPress={onPressCreateComment} />
          </HoliContainer>
        </View>
      </SafeAreaView>
    </>
  )
}

const LoadingSkeleton = () => <HoliSkeleton height={100} width={'100%'} borderRadius={0} />

const getStyles = ({ colors }: HoliTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    wrapper: {
      height: '100%',
      flex: 1,
      backgroundColor: colors.background20,
      ...Platform.select({
        web: {
          minHeight: '100%',
          paddingTop: dimensions.topBarHeight,
          paddingBottom: dimensions.bottomBarHeight + Spacing.xl,
        },
        ios: {
          paddingTop: dimensions.topBarHeight + insets.top - Spacing['3xs'],
        },
        android: {
          paddingTop: dimensions.topBarHeight + Spacing.xl,
        },
      }),
    },
    wrapperContent: {
      paddingBottom: 0,
    },
    scrollView: {
      height: '100%',
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
      paddingTop: 18,
      flex: 1,
    },
  })

export default memo(DiscussionDetailPage)
