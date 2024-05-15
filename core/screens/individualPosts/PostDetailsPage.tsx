import { useQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import HoliHead from '@holi/core/components/HoliHead'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useUserVisitedScreensCount } from '@holi/core/components/TrackingConsentModal'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import Comments from '@holi/core/screens/comments/components/Comments'
import { CommentableType } from '@holi/core/screens/comments/types'
import PostContent from '@holi/core/screens/individualPosts/components/PostContent'
import PostDrawer from '@holi/core/screens/individualPosts/components/PostDrawer'
import { PostQueryResponse, postQuery } from '@holi/core/screens/individualPosts/queries'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft, MoreFilled, Share } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import FeedPostReactions from './components/FeedPostReactions'

export type PostDetailsPageParams = {
  idOrSlug: string
  commentId: string
}

const { useParam } = createParamHooks<PostDetailsPageParams>()

const PostDetailsPage = () => {
  const [idOrSlug] = useParam('idOrSlug')
  const [commentId] = useParam('commentId') // if there is a commentId, open its replies by default (usually after a new comment is made)
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { replaceRoute, navigate, navigateBack } = useRouting()
  const { userId, isLoggedIn } = useAuth()
  const { openLoginModal } = useLoginModal()
  const insets = useSafeAreaInsets()
  const isWeb = Platform.OS === 'web'
  const styles = useMemo(() => getStyles(theme, insets, isWeb), [theme, insets, isWeb])

  const visitedScreensCount = useUserVisitedScreensCount()

  const headerLeft = useMemo(() => {
    const directPageVisit = visitedScreensCount <= 1
    return directPageVisit ? (
      <HoliButton transparent inline label={t('navigation.title')} onPress={() => navigate('/')}>
        <HoliLogo />
      </HoliButton>
    ) : (
      <HeaderBackButton icon={ArrowLeft} />
    )
  }, [navigate, t, visitedScreensCount])

  const {
    data: { post } = {},
    refetch,
    loading,
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

  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const [, shareLink] = useShareLink({
    link: `/feed-posts/${post?.slug}`,
    linkType: LinkType.UNIVERSAL,
    message: post?.title ?? '',
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerLeft: () => headerLeft,
      headerTitle: ({ tintColor }) => (
        <HeaderTitle tintColor={tintColor}>
          {t('individuals.post.details.title', { name: post?.creator.firstName })}
        </HeaderTitle>
      ),
      headerRight: () => {
        return (
          post && (
            <View style={styles.headerRight}>
              <HoliButton transparent label="btn-share-feed-post" inline onPress={shareLink}>
                <HoliIcon icon={Share} />
              </HoliButton>
              <PostDrawer post={post} onDelete={navigateBack}>
                <HoliIcon icon={MoreFilled} />
              </PostDrawer>
            </View>
          )
        )
      },
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [post, setScreenOptions, styles.headerRight, t, navigateBack, shareLink, headerLeft])

  const onPressCreateComment = () =>
    isLoggedIn
      ? navigate(`/feed-posts/${idOrSlug}/comment`)
      : openLoginModal({
          description: t('comments.loginRedirect.text'),
        })

  return (
    <>
      <HoliHead
        title={`${post?.title} | ${post?.creator.fullName}`}
        description={post?.description}
        ogTitle={`${post?.title} | ${post?.creator.fullName}`}
        ogDescription={post?.description}
        ogImage={post?.image}
      />
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
        <HoliContainer noPadding={loading && !isWeb}>
          <ScrollView style={styles.scrollView}>
            {post && !loading ? (
              <>
                <PostContent post={post} showVisibilityBadge={post.creator.id === userId} />
                <View style={styles.commentsContainer}>
                  <Comments
                    commentableType={CommentableType.FEED_POST}
                    commentableId={post.id}
                    replyRoute={`/feed-posts/${post.slug}/comment`}
                    initialOpenThread={commentId}
                    reactionButton={<FeedPostReactions post={post} />}
                    localeKey="comments.response"
                  />
                </View>
              </>
            ) : (
              <LoadingSkeleton />
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

const LoadingSkeleton = () => (
  <View style={skeletonStyles.container}>
    <View style={skeletonStyles.userBox}>
      <HoliSkeleton height={44} width={44} borderRadius={80} />
      <View style={skeletonStyles.metadata}>
        <HoliSkeleton height={22} width={120} borderRadius={10} />
        <HoliSkeleton height={14} width={80} borderRadius={10} />
      </View>
    </View>
    <HoliSkeleton height={22} width={200} borderRadius={20} />
    <HoliSkeleton height={60} width="100%" borderRadius={10} />
    <HoliSkeleton height={160} width="100%" borderRadius={20} />
  </View>
)

const skeletonStyles = StyleSheet.create({
  container: {
    gap: 10,
    padding: Spacing.xs,
  },
  userBox: {
    flexDirection: 'row',
    gap: 10,
  },
  metadata: {
    gap: 6,
  },
})

const getStyles = ({ colors }: HoliTheme, insets: EdgeInsets, isWeb = false) =>
  StyleSheet.create({
    wrapper: {
      width: 'auto',
      height: '100%',
      flex: 1,
      backgroundColor: colors.background10,
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
      ...(!isWeb ? { paddingHorizontal: Spacing['3xs'] } : {}),
    },
    commentsContainer: {
      marginTop: Spacing.xs,
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
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
  })

export default memo(PostDetailsPage)
