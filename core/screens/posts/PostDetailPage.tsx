import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { type LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native'
import type Animated from 'react-native-reanimated'

import HoliHead from '@holi/core/components/HoliHead'
import { isForbiddenError, isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import { commentsByCommentable, type CommentsResponse } from '@holi/core/screens/comments/queries'
import { type Comment, CommentableType } from '@holi/core/screens/comments/types'
import PostContent from '@holi/core/screens/posts/components/PostContent'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import { PostById, type PostByIdResponse } from '@holi/core/screens/posts/queries'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { TrackingEvent } from '@holi/core/tracking'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import FormLayout from '@holi/core/components/FormLayout/FormLayout'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

export type PostDetailPageParams = {
  postId: string
  commentId?: string
  insightId?: string
  spaceIdOrName?: string
}

const { useParam, useUUIDParam } = createParamHooks<PostDetailPageParams>()

const COMMENT_BUTTON_CONTAINER_HEIGHT = 74
const COMMENT_VIEW_PADDING_BOTTOM = 120

const PostDetailPage = () => {
  const [insightId] = useUUIDParam('insightId')
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [postId] = useUUIDParam('postId')
  // `commentId` can be a UUID of a comment or hardcoded 'first' string value
  const [commentId] = useUUIDParam('commentId')
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { navigateWithAuth } = useAuthRequiredNavigation()

  const { space } = useSpace(spaceIdOrName)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)

  const { t } = useTranslation()
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
      // if the post is not found, forbidden or the id is not a valid UUID, redirect to 404
      if (
        isNotFoundError(error) ||
        isForbiddenError(error) ||
        error.message.includes('badly formed hexadecimal UUID string')
      ) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load post', { location: 'PostDetailPage.PostById', postId })
    },
  })

  const {
    data: { commentable } = {},
    refetch: refetchComments,
  } = useQuery<CommentsResponse>(commentsByCommentable, {
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
  const fallbackRoute = insightId ? `/insights/${insightId}` : spaceIdOrName ? `/spaces/${spaceIdOrName}` : '/'

  useIsomorphicLayoutEffect(
    () =>
      setScreenOptions({
        title,
        navigationCustomOptions: {
          footerShown: false,
        },
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} fallbackRoute={fallbackRoute} />,
      }),
    [fallbackRoute, setScreenOptions, title]
  )

  useTrackOnce(post && space && TrackingEvent.SpacePosts.read(post.id, post.title, space.id))

  const scrollIntoView = useCallback(
    (event: LayoutChangeEvent) => {
      const { y, height } = event.nativeEvent.layout
      const { target } = event.nativeEvent as unknown as { target: HTMLElement }

      if (isWeb) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      } else {
        scrollViewRef.current?.scrollTo({
          y: y + height + COMMENT_VIEW_PADDING_BOTTOM * 2, // mobile scrolling does not work reliable, it is why '2' multiplier is used
          animated: true,
        })
      }
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

      <FormLayout
        backgroundColor={theme.colors.background10}
        bottomBar={
          <View style={styles.postCommentWrapper}>
            <HoliContainer flex={1}>
              <PostDetailFooter
                style={styles.postCommentButton}
                onPress={() =>
                  navigateWithAuth(getPostCommentUrl(), {
                    description: t('comments.loginRedirect.text'),
                    trackTrigger: 'COMMENT_ON_POST',
                  })
                }
              />
            </HoliContainer>
          </View>
        }
      >
        <View testID="post-detail-page">
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
      </FormLayout>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    postContent: {
      marginTop: 12,
      paddingBottom: 12,
    },
    commentsView: {
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
      backgroundColor: theme.colors.background10,
      borderTopWidth: 1,
      width: '100%',
      height: COMMENT_BUTTON_CONTAINER_HEIGHT,
    },
    postCommentButton: {
      flex: 1,
    },
  })

export default withProfiler(memo(PostDetailPage), { name: 'PostDetailPage' })
