import { useMutation, useQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliHead from '@holi/core/components/HoliHead'
import type { Term } from '@holi/core/domain/shared/types'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import generatePostTitle from '@holi/core/i18n/helpers/generatePostTitle'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import Comments from '@holi/core/screens/comments/components/Comments'
import { CommentableType } from '@holi/core/screens/comments/types'
import FeedPostReactions from '@holi/core/screens/individualPosts/components/FeedPostReactions'
import PostContent from '@holi/core/screens/individualPosts/components/PostContent'
import PostDrawer from '@holi/core/screens/individualPosts/components/PostDrawer'
import {
  UpdateFeedPostReactionMutation,
  type UpdateFeedPostReactionResponse,
} from '@holi/core/screens/individualPosts/mutations'
import { type PostQueryResponse, postQuery } from '@holi/core/screens/individualPosts/queries'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import { ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { TrackingEvent } from '@holi/core/tracking'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled, Share } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import FormLayout from '@holi/core/components/FormLayout/FormLayout'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'

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
  const loginState = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const smStyle = useBreakpointMatcher([[dimensions.breakpointS, true]])
  const styles = useMemo(() => getStyles(theme, !!smStyle), [theme, smStyle])
  const { topics: allTopics } = useContext(SpaceTermContext)
  const { displayError } = useErrorHandling()
  const { track } = useTracking()
  const { navigateWithAuth } = useAuthRequiredNavigation()

  const {
    data: { post } = {},
    refetch,
    loading,
  } = useQuery<PostQueryResponse>(postQuery, {
    variables: { idOrSlug },
    skip: !idOrSlug,
    onError: (error) => {
      // if the post is not found, or the id is not a valid UUID, redirect to 404
      if (isNotFoundError(error) || error.message.includes('badly formed hexadecimal UUID string')) {
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
    loginState.isLoggedIn && loginState.user.id === post?.author.id
      ? t('individuals.post.details.title.personal')
      : generatePostTitle({
          name: post?.author.firstName || '',
          currentLanguage,
          t,
        })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTintColor: theme.colors.black300,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerLeft: ({ tintColor }) => (
        <HoliTransition.FadeLeft visible>
          <HoliButton transparent inline label={t('navigation.title')} onPress={() => navigate('/')}>
            <HoliLogo color={tintColor} />
          </HoliButton>
        </HoliTransition.FadeLeft>
      ),
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
  }, [
    headerTitle,
    loading,
    navigateBack,
    post,
    setScreenOptions,
    shareLink,
    styles.headerRight,
    t,
    navigate,
    theme.colors.black300,
  ])

  useTrackOnce(post && TrackingEvent.FeedPosts.read(post.id))

  const onPressCreateComment = () =>
    navigateWithAuth(`/feed-posts/${idOrSlug}/comment`, {
      description: t('comments.loginRedirect.text'),
      trackTrigger: 'COMMENT_ON_POST',
    })

  const heartReactions = post?.reactions.HEART
  const currentUserHasReacted = !!post?.myReaction.HEART

  const [updateFeedPostReaction] = useMutation<UpdateFeedPostReactionResponse>(UpdateFeedPostReactionMutation, {
    onError: (error) =>
      displayError(error, 'Failed to update feed post reaction', {
        location: 'FeedPostReactions.updateFeedPostReaction',
        postId: post?.id,
      }),
  })

  const reactOnPost = () => {
    if (!loginState.isLoggedIn) {
      openSignupModal({
        description: t('individuals.post.reaction.loginRedirect.text'),
        trackTrigger: 'REACT_COMMENT_ON_POST',
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
          if (reactionAction === ReactionAction.SET) {
            track(TrackingEvent.Engaging.reacted('FeedPost', post?.id || ''))
          }
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

      <FormLayout
        backgroundColor={theme.colors.background10}
        bottomBar={
          <View style={styles.commentWrapper}>
            <HoliContainer flex={1}>
              <PostDetailFooter style={[styles.commentButton]} onPress={onPressCreateComment} />
            </HoliContainer>
          </View>
        }
      >
        <View style={[styles.wrapper, styles.wrapperContent]} testID="post-detail-page">
          {post && !loading ? (
            <>
              <PostContent
                post={post}
                showVisibilityBadge={loginState.isLoggedIn && loginState.user.id === post.author.id}
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
          {!post?.totalComments && (
            <View style={styles.reactions}>
              <HoliReactionsCount
                onPress={reactOnPost}
                type="post"
                count={heartReactions}
                active={currentUserHasReacted}
                fullName={post?.author.fullName}
                testID="btn-react-to-feed-post-HEART"
              />
            </View>
          )}
        </View>
      </FormLayout>
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

const getStyles = ({ colors }: HoliTheme, isSm = false) =>
  StyleSheet.create({
    wrapper: {
      width: 'auto',
      height: '100%',
      flex: 1,
      backgroundColor: colors.background10,
    },
    wrapperContent: {
      paddingBottom: dimensions.bottomBarHeight + Spacing.xl,
    },
    commentsContainer: {
      marginTop: isSm ? Spacing.md : Spacing.xs,
      backgroundColor: colors.background10,
      borderBottomLeftRadius: Spacing.lg,
      borderBottomRightRadius: Spacing.lg,
    },
    reactions: {
      alignItems: 'flex-end',
    },
    commentWrapper: {
      backgroundColor: colors.background10,
      borderTopColor: colors.background30,
      borderTopWidth: 1,
      width: '100%',
      height: 74,
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
