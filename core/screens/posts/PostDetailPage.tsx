import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliHead from '@holi/core/components/HoliHead'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isForbiddenError, isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import { CommentsResponse, commentsByCommentable } from '@holi/core/screens/comments/queries'
import { Comment, CommentableType } from '@holi/core/screens/comments/types'
import PostContent from '@holi/core/screens/posts/components/PostContent'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import { PostById, PostByIdResponse } from '@holi/core/screens/posts/queries'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostDetailPageParams = {
  postId: string
  commentId?: string
  insightId?: string
  spaceIdOrName?: string
}

const { useParam } = createParamHooks<PostDetailPageParams>()

const COMMENT_BUTTON_CONTAINER_HEIGHT = 74
const COMMENT_VIEW_PADDING_BOTTOM = 120

const PostDetailPage = () => {
  const [insightId] = useParam('insightId')
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [postId] = useParam('postId')
  // `commentId` can be a UUID of a comment or hardcoded 'first' string value
  const [commentId] = useParam('commentId')
  const { navigate, replaceRoute } = useRouting()
  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const setScreenOptions = useSetScreenOptions()

  const { space } = useSpace(spaceIdOrName)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { width: screenWidth } = useClientWindowDimensions()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const scrollViewRef = useRef<Animated.ScrollView>(null)

  const isWeb = Platform.OS === 'web'

  const {
    loading,
    error,
    data,
    refetch: refetchPost,
  } = useQuery<PostByIdResponse>(PostById, {
    variables: { id: postId },
    skip: !postId,
    onError: (error) => {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load post', { location: 'PostDetailPage.PostById', postId })
    },
  })

  const { data: { commentable } = {}, refetch: refetchComments } = useQuery<CommentsResponse>(commentsByCommentable, {
    variables: { commentableId: postId, commentableType: CommentableType.POST },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      logError(error, 'Failed to load comments', {
        location: 'Comments',
        variables: { commentableId: postId, commentableType: CommentableType.POST },
      })
    },
  })
  useOnRefresh(refetchPost)
  useOnRefresh(refetchComments)

  const post = data?.postById
  const title = post?.title
  const comments: readonly Comment[] = commentable?.comments?.data || []

  useIsomorphicLayoutEffect(
    () =>
      setScreenOptions({
        title,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setScreenOptions, title]
  )

  useTrackOnce(post && space && TrackingEvent.SpacePosts.read(post.id, space.id))

  const scrollIntoView = useCallback(
    (event: LayoutChangeEvent) => {
      const { y, height } = event.nativeEvent.layout
      const { target } = event.nativeEvent as unknown as { target: HTMLElement }

      isWeb
        ? target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
        : scrollViewRef.current?.scrollTo({
            y: y + height + COMMENT_VIEW_PADDING_BOTTOM * 2, // mobile scrolling does not work reliable, it is why '2' multiplier is used
            animated: true,
          })
    },
    [isWeb]
  )

  if (loading) {
    return <HoliLoader />
  }

  // Error and loading states are handled the same way and just hide the component
  if (error || !post) {
    return <></>
  }

  const hasVisibilityIcon = spaceIdOrName !== '' && isMember

  const getPostCommentUrl = () => {
    return `${getPostUrl(post.id, insightId, spaceIdOrName)}/comment`
  }

  return (
    <>
      <HoliHead
        title={`${post.title} | ${post.creator.fullName}`}
        description={post.text}
        ogTitle={`${post.title} | ${post.creator.fullName}`}
        ogDescription={post.text}
        ogImage={post.image?.url}
      />
      <StatusBar animated />

      <ScrollHeaderLayout ref={scrollViewRef}>
        <View style={screenWidth > dimensions.breakpointXl && mixins.container} testID="post-detail-view">
          <PostContent
            hasVisibilityIcon={hasVisibilityIcon}
            style={styles.postContent}
            {...{ post, spaceIdOrName, insightId }}
          />

          {/* Post comments */}
          {comments.length > 0 && (
            <View style={styles.commentsView}>
              <VerticalLine style={styles.commentConnector} />

              {comments.map((comment, idx) => {
                const scrollToFirstComment = commentId === 'first' && idx === 0
                const isCommentToScroll = commentId === comment.id

                return (
                  <CommentView
                    key={comment.id}
                    comment={comment}
                    commentableId={post.id}
                    commentableType={CommentableType.POST}
                    style={styles.comment}
                    onLayout={scrollToFirstComment || isCommentToScroll ? scrollIntoView : undefined}
                  />
                )
              })}
            </View>
          )}
        </View>
      </ScrollHeaderLayout>

      <SafeArea edges={['bottom']}>
        <View style={styles.postCommentWrapper}>
          <PostDetailFooter
            style={[styles.postCommentButton, isWeb && mixins.container]}
            onPress={() =>
              isLoggedIn
                ? navigate(getPostCommentUrl())
                : openSignupModal({
                    description: t('comments.loginRedirect.text'),
                    trackTrigger: 'COMMENT_ON_POST',
                  })
            }
          />
        </View>
      </SafeArea>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    postContent: {
      marginTop: 12,
    },
    commentsView: {
      paddingHorizontal: 20,
      ...Platform.select({
        web: {
          paddingBottom: COMMENT_VIEW_PADDING_BOTTOM,
        },
      }),
    },
    commentConnector: {
      marginTop: 12,
      marginHorizontal: 20,
    },
    comment: {
      marginTop: 12,
    },
    postCommentWrapper: {
      borderTopColor: theme.colors.background30,
      borderTopWidth: 1,
      width: '100%',
      height: COMMENT_BUTTON_CONTAINER_HEIGHT,
      ...Platform.select({
        web: {
          position: 'fixed',
          bottom: 0,
        },
      }),
    },
    postCommentButton: {
      flex: 1,
    },
  })

export default withProfiler(memo(PostDetailPage), { name: 'PostDetailPage' })
