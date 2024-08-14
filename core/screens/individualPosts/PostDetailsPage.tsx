import { useMutation, useQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'

import { useLoginState } from '@holi/core/auth/loginState'
import HoliHead from '@holi/core/components/HoliHead'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import generatePostTitle from '@holi/core/i18n/helpers/generatePostTitle'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import Comments from '@holi/core/screens/comments/components/Comments'
import { CommentableType } from '@holi/core/screens/comments/types'
import PostContent from '@holi/core/screens/individualPosts/components/PostContent'
import PostDrawer from '@holi/core/screens/individualPosts/components/PostDrawer'
import {
  UpdateFeedPostReactionMutation,
  UpdateFeedPostReactionResponse,
} from '@holi/core/screens/individualPosts/mutations'
import { PostQueryResponse, postQuery } from '@holi/core/screens/individualPosts/queries'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import { ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Term } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { TrackingEvent } from '@holi/core/tracking'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft, MoreFilled, Share } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'
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
  const { t, i18n } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { replaceRoute, navigate, navigateBack } = useRouting()
  const loginState = useLoginState()
  const { openLoginModal } = useLoginModal()
  const insets = useSafeAreaInsets()
  const smStyle = useBreakpointMatcher([[dimensions.breakpointS, true]])
  const isWeb = Platform.OS === 'web'
  const styles = useMemo(() => getStyles(theme, insets, isWeb, !!smStyle), [theme, insets, isWeb, smStyle])
  const { topics: allTopics } = useContext(SpaceTermContext)
  const { isLoggedIn } = useLoggedInUser()
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const headerLeft = useMemo(() => {
    const directPageVisit = Platform.OS === 'web' // TODO: Implement a useUserVisitedScreenCount hook in order to know the number of visited screens
    return directPageVisit ? (
      <HoliButton transparent inline label={t('navigation.title')} onPress={() => navigate('/')}>
        <HoliLogo />
      </HoliButton>
    ) : (
      <HeaderBackButton icon={ArrowLeft} />
    )
  }, [navigate, t])

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

  let aggregatedTopics: Term[] = []
  if (post?.topics) {
    aggregatedTopics = allTopics?.filter((topic) => {
      return post.topics?.some((selectedTopic: Term) => selectedTopic.id === topic.id)
    })
  }

  useOnRefresh(refetch)

  const [, shareLink] = useShareLink({
    link: `/feed-posts/${post?.slug}`,
    linkType: LinkType.UNIVERSAL,
    message: post?.title ?? '',
  })

  const currentLanguage = getLocale(i18n.language || '')

  const headerTitle =
    loginState.isLoggedIn && loginState.userId === post?.author.id
      ? t('individuals.post.details.title.personal')
      : generatePostTitle({
          name: post?.author.firstName || '',
          currentLanguage,
          t,
        })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerLeft: () => headerLeft,
      headerTitle: ({ tintColor }) => !loading && <HeaderTitle tintColor={tintColor}>{headerTitle}</HeaderTitle>,
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
  }, [headerLeft, headerTitle, loading, navigateBack, post, setScreenOptions, shareLink, styles.headerRight])

  useTrackOnce(post && TrackingEvent.FeedPosts.read(post.id))

  const onPressCreateComment = () =>
    loginState.isLoggedIn
      ? navigate(`/feed-posts/${idOrSlug}/comment`)
      : openLoginModal({
          description: t('comments.loginRedirect.text'),
        })

  const heartReactions = post?.reactions.HEART
  const currentUserHasReacted = !!post?.myReaction.HEART

  const [updateFeedPostReaction, { loading: loadingReaction }] = useMutation<UpdateFeedPostReactionResponse>(
    UpdateFeedPostReactionMutation,
    {
      onError: (error) =>
        displayError(error, 'Failed to update feed post reaction', {
          location: 'FeedPostReactions.updateFeedPostReaction',
          postId: post?.id,
        }),
    }
  )

  const reactOnPost = () => {
    if (!isLoggedIn) {
      openLoginModal({
        description: t('individuals.post.reaction.loginRedirect.text'),
      })
    } else {
      const reactionAction = currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET
      const reactionType = ReactionType.HEART
      updateFeedPostReaction({
        variables: {
          postId: post?.id,
          reactionType: reactionType,
          reactionAction: reactionAction,
        },
        onCompleted: () => {
          reactionAction === ReactionAction.SET && track(TrackingEvent.Engaging.reacted('FeedPost', post?.id || ''))
        },
      })
    }
  }

  return (
    <>
      <HoliHead
        title={`${post?.title} | ${post?.author.fullName}`}
        description={post?.description}
        ogTitle={`${post?.title} | ${post?.author.fullName}`}
        ogDescription={post?.description}
        ogImage={post?.imageUrl}
      />
      <StatusBar backgroundColor={theme.colors.background10} style={theme.dark ? 'light' : 'dark'} />

      <ScrollHeaderLayout>
        <View style={[styles.wrapper, styles.wrapperContent]}>
          <HoliContainer noPadding={loading && !isWeb} testID="post-detail-page">
            <ScrollView style={styles.scrollView}>
              {post && !loading ? (
                <>
                  <PostContent
                    post={post}
                    showVisibilityBadge={loginState.isLoggedIn && loginState.userId === post.author.id}
                    aggregatedTopics={aggregatedTopics}
                  />
                  <View style={styles.commentsContainer}>
                    <Comments
                      commentableType={CommentableType.FEED_POST}
                      commentableId={post.id}
                      replyRoute={`/feed-posts/${post.slug}/comment`}
                      initialOpenThread={commentId}
                      reactionButton={<FeedPostReactions post={post} />}
                      isDiscussion={false}
                    />
                  </View>
                </>
              ) : (
                <LoadingSkeleton />
              )}
            </ScrollView>
            <HoliReactionsCount
              onPress={reactOnPost}
              type="post"
              count={heartReactions}
              active={currentUserHasReacted}
              fullName={post?.author.fullName}
              testID="btn-react-to-feed-post-HEART"
              disabled={loadingReaction}
            />
          </HoliContainer>
        </View>
      </ScrollHeaderLayout>

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

const getStyles = ({ colors }: HoliTheme, insets: EdgeInsets, isWeb = false, isSm = false) =>
  StyleSheet.create({
    wrapper: {
      width: 'auto',
      height: '100%',
      flex: 1,
      backgroundColor: colors.background10,
      ...Platform.select({
        web: {
          minHeight: '100%',
          paddingTop: dimensions.topBarHeight + Spacing.md,
          paddingBottom: dimensions.bottomBarHeight + Spacing.xl,
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
      marginTop: isSm ? Spacing.md : Spacing.xs,
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
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
  })

export default memo(PostDetailsPage)
