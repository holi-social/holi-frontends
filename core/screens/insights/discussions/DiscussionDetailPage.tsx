import { useQuery } from '@apollo/client'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import Comments from '@holi/core/screens/comments/components/Comments'
import { CommentableType } from '@holi/core/screens/comments/types'
import { DiscussionResponse, discussionById } from '@holi/core/screens/insights/queries'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
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
  const { replaceRoute } = useRouting()

  const [discussionId] = useParam('discussionId')

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
      headerTitle: ({ tintColor }) => (
        <HeaderTitle tintColor={tintColor}>{t('insights.discussions.pageTitle')}</HeaderTitle>
      ),
    })
  }, [theme.colors.background10, t, setScreenOptions])

  return (
    <ScrollHeaderLayout.Refreshable
      refreshableProps={{
        refreshing,
        onRefresh,
      }}
      style={styles.wrapper}
      headerOverlap
    >
      <HoliContainer>
        {discussion && !loading ? (
          <View style={styles.questionContainer}>
            <View style={styles.question}>
              <HoliText bold>{discussion.question}</HoliText>
            </View>
          </View>
        ) : (
          <LoadingSkeleton />
        )}
        {discussionId && <Comments commentableType={CommentableType.DISCUSSION} commentableId={discussionId} />}
      </HoliContainer>
    </ScrollHeaderLayout.Refreshable>
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
          paddingTop: dimensions.topBarHeight + Spacing.xxl,
        },
        android: {
          paddingTop: dimensions.topBarHeight + Spacing.lg,
        },
      }),
    },
    questionContainer: {
      padding: Spacing.xs,
      backgroundColor: colors.brandA200,
    },
    question: {
      padding: Spacing.xs,
      backgroundColor: theme.colors.background20,
      borderColor: colors.black300,
      borderWidth: 1,
      borderRadius: Spacing.xs,
    },
  })

export default memo(DiscussionDetailPage)
