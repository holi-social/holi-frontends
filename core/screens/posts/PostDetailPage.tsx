import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useCallback, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LayoutChangeEvent,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import CommentView from '@holi/core/screens/posts/components/CommentView'
import PostContent from '@holi/core/screens/posts/components/PostContent'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import VerticalLine from '@holi/core/screens/posts/components/VerticalLine'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import { PostById, PostByIdResponse } from '@holi/core/screens/posts/queries'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import type { InsightsScreens } from '@holi/mobile/navigation/InsightsNavigator'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostDetailPageParams = {
  postId: string
  commentId?: string
  insightId?: string
  spaceIdOrName?: string
}

const { useParam } = createParam<PostDetailPageParams>()

type ScreenProps = NativeStackScreenProps<InsightsScreens | SpacesScreens>

const COMMENT_BUTTON_CONTAINER_HEIGHT = 74
const COMMENT_VIEW_PADDING_BOTTOM = 120

const PostDetailPage: React.VFC<ScreenProps> = () => {
  const [insightId = ''] = useParam('insightId')
  const [spaceIdOrName = ''] = useParam('spaceIdOrName')
  const [postId] = useParam('postId')
  // `commentId` can be a UUID of a comment or hardcoded 'first' string value
  const [commentId] = useParam('commentId')
  const { navigate, replaceRoute } = useRouting()
  const { isLoggedIn } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const setScreenOptions = useSetScreenOptions()

  const queryResult = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName || '' },
    fetchPolicy: 'cache-and-network', // ensures that all required fields are eventually present
    skip: !spaceIdOrName,
  })
  const space = queryResult.data?.spaceById
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { width: screenWidth } = useWindowDimensions()

  const scrollViewRef = useRef<ScrollView>(null)

  const isWeb = Platform.OS === 'web'

  const { loading, error, data, refetch } = useQuery<PostByIdResponse>(PostById, {
    variables: { id: postId },
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load post', { location: 'PostDetailPage.PostById', postId })
    },
  })
  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const title = data?.postById?.title

  useLayoutEffect(
    () =>
      setScreenOptions({
        title,
        headerStyle: { backgroundColor: colors.background10 },
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setScreenOptions, title]
  )

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

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  const post = data?.postById

  if (!post) return <HoliText>{t('insights.post.notFound', { postId })}</HoliText>

  const comments = post.comments || []

  const hasVisibilityIcon = spaceIdOrName !== '' && isMember

  const getPostCommentUrl = () => {
    return `${getPostUrl(post.id, insightId, spaceIdOrName)}/comment`
  }

  return (
    <>
      <StatusBar animated />

      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        ref={scrollViewRef}
      >
        <View style={screenWidth > +vars.breakpointXl && mixins.container} testID="post-detail-view">
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
                    postId={post.id}
                    style={styles.comment}
                    onLayout={scrollToFirstComment || isCommentToScroll ? scrollIntoView : undefined}
                  />
                )
              })}
            </View>
          )}
        </View>
      </ScrollHeaderLayout.Refreshable>

      <SafeAreaView>
        <View style={styles.postCommentWrapper}>
          <PostDetailFooter
            style={[styles.postCommentButton, isWeb && mixins.container]}
            onPress={() => (isLoggedIn ? navigate(getPostCommentUrl()) : openLoginModal())}
          />
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
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
    borderTopColor: colors.background30,
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
    paddingTop: 18,
    flex: 1,
  },
})

export default withProfiler(memo(PostDetailPage), { name: 'PostDetailPage' })
