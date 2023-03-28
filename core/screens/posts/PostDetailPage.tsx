import { useQuery } from '@apollo/client'
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

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { useLoginModal } from '@holi/core/provider/LoginModalProvider'
import CommentView from '@holi/core/screens/posts/components/CommentView'
import PostContent from '@holi/core/screens/posts/components/PostContent'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import VerticalLine from '@holi/core/screens/posts/components/VerticalLine'
import { PostById, PostByIdResponse } from '@holi/core/screens/posts/queries'
import type { InsightsScreens } from '@holi/mobile/navigation/InsightsNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostDetailPageParams = {
  postId: string
  commentId?: string
  insightId?: string
}

const { useParam } = createParam<PostDetailPageParams>()

type ScreenProps = NativeStackScreenProps<InsightsScreens>

const COMMENT_BUTTON_CONTAINER_HEIGHT = 74
const COMMENT_VIEW_PADDING_BOTTOM = 120

const PostDetailPage: React.VFC<ScreenProps> = () => {
  const [insightId = ''] = useParam('insightId')
  const [postId] = useParam('postId')
  // `commentId` can be an UUID of a comment of hardcodded 'first' string value
  const [commentId] = useParam('commentId')
  const { navigate } = useRouting()
  const { isLoggedIn } = useAuth()
  const { openLoginModal } = useLoginModal()

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const { width: screenWidth } = useWindowDimensions()

  const scrollViewRef = useRef<ScrollView>(null)

  const isWeb = Platform.OS === 'web'

  const { loading, error, data } = useQuery<PostByIdResponse>(PostById, {
    variables: { id: postId },
  })

  const title = data?.postById?.title

  useLayoutEffect(
    () =>
      setOptions({
        title,
        headerStyle: { backgroundColor: colors.background10 },
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, title]
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

  if (error) {
    logError(error, `[Post.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  const post = data?.postById

  if (!post) return <HoliText>{t('insights.post.notFound', { postId })}</HoliText>

  const comments = post.comments || []

  return (
    <>
      <StatusBar animated />

      <DefaultScrollHeaderLayout ref={scrollViewRef}>
        <View style={screenWidth > +vars.breakpointXl && mixins.container} testID="post-detail-view">
          <PostContent post={post} style={styles.postContent} />

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
      </DefaultScrollHeaderLayout>

      <SafeAreaView>
        <View style={styles.postCommentWrapper}>
          <PostDetailFooter
            style={[styles.postCommentButton, isWeb && mixins.container]}
            onPress={() =>
              isLoggedIn
                ? navigate(`${insightId && `/insights/${insightId}`}/posts/${post.id}/comment`)
                : openLoginModal()
            }
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

export default memo(PostDetailPage)
