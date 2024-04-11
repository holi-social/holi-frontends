import { useQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

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
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type DiscussionDetailPageParams = {
  discussionId: string
  insightId: string
}

const { useParam } = createParamHooks<DiscussionDetailPageParams>()

const DiscussionDetailPage = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { replaceRoute, navigate } = useRouting()
  const { isLoggedIn } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()

  const [discussionId] = useParam('discussionId')
  const [insightId] = useParam('insightId')

  const styles = useMemo(() => getStyles(theme), [theme])

  const {
    data: { discussionById: discussion } = {},
    refetch,
    loading,
  } = useQuery<DiscussionResponse>(discussionById, {
    variables: { discussionId },
    notifyOnNetworkStatusChange: true,
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
    })
  }, [theme.colors.background10, t, setScreenOptions])

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
      >
        <HoliContainer paddingHorizontal={0}>
          {discussion && !loading ? <DiscussionHeader question={discussion.question} /> : <LoadingSkeleton />}
          {discussionId && (
            <View style={styles.commentsContainer}>
              <Comments commentableType={CommentableType.DISCUSSION} commentableId={discussionId} />
            </View>
          )}
        </HoliContainer>
      </ScrollHeaderLayout.Refreshable>

      <SafeAreaView>
        <View style={styles.commentWrapper}>
          <HoliContainer flex={1}>
            <PostDetailFooter
              style={[styles.commentButton]}
              onPress={() =>
                isLoggedIn
                  ? navigate(`/insights/${insightId}/discussions/${discussionId}/comment`)
                  : openLoginModal({
                      description: t('comments.loginRedirect.text'),
                    })
              }
            />
          </HoliContainer>
        </View>
      </SafeAreaView>
    </>
  )
}

const LoadingSkeleton = () => <HoliSkeleton height={100} width={'100%'} borderRadius={0} />

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background20,
      ...Platform.select({
        web: {
          minHeight: '100%',
          paddingTop: dimensions.topBarHeight,
          paddingBottom: Spacing.lg,
        },
        ios: {
          paddingTop: dimensions.topBarHeight + Spacing.xxs,
        },
        android: {
          paddingTop: dimensions.topBarHeight + Spacing.xxl,
        },
      }),
    },
    commentsContainer: {
      padding: Spacing.xs,
      backgroundColor: colors.background10,
      borderBottomLeftRadius: Spacing.lg,
      borderBottomRightRadius: Spacing.lg,
    },
    commentWrapper: {
      backgroundColor: theme.colors.background10,
      borderTopColor: theme.colors.background30,
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
