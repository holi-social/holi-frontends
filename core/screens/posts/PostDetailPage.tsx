import { useLazyQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import CommentView from '@holi/core/screens/posts/components/CommentView'
import PostDetail from '@holi/core/screens/posts/components/PostDetail'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import VerticalLine from '@holi/core/screens/posts/components/VerticalLine'
import { getPostCommenters } from '@holi/core/screens/posts/components/helpers'
import { PostById, PostByIdResponse } from '@holi/core/screens/posts/queries'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostDetailPageParams = {
  insightId: string
  postId: string
}

const { useParam } = createParam<PostDetailPageParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const PostDetailPage: React.VFC<ScreenProps> = () => {
  const [showLoginConfirmation, setShowLoginConfirmation] = useState(false)
  const [insightId] = useParam('insightId')
  const [postId] = useParam('postId')
  const { navigate } = useRouting()
  const { user } = useContext(UserContext)

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()

  const isWeb = Platform.OS === 'web'

  const [getPost, { loading, error, data }] = useLazyQuery<PostByIdResponse>(PostById, {
    variables: { id: postId },
  })

  const onScreenScroll = useScrollYHandler()

  const title = data?.postById?.title

  useLayoutEffect(
    () =>
      setOptions({
        title,
        headerStyle: { backgroundColor: colors.backgroundColorWhite },
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, title]
  )

  useEffect(() => {
    if (postId) getPost()
  }, [postId, getPost])

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

  const commenters = getPostCommenters(comments)

  return (
    <>
      <StatusBar animated />
      <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
        <PostDetail post={post} />

        {post.image && (
          <PostImage uri={post.image.url} height={post.image.height} width={post.image.width} postTitle={post.title} />
        )}

        {/* Post comments */}
        {comments.length > 0 && (
          <View style={[mixins.container, styles.commentsView]}>
            <HoliUserAvatarPile users={commenters} usersToShow={3} collapse>
              {t('insights.post.response', { count: comments.length })}
            </HoliUserAvatarPile>

            <VerticalLine style={styles.commentConnector} />

            {comments.map((comment) => (
              <CommentView key={comment.id} comment={comment} style={styles.comment} />
            ))}
          </View>
        )}
      </DefaultLayout>

      <SafeAreaView>
        <PostDetailFooter
          style={[styles.postCommentButton, isWeb && mixins.container]}
          onPress={() =>
            user ? navigate(`/insights/${insightId}/posts/${post.id}/comment`) : setShowLoginConfirmation(true)
          }
        />
      </SafeAreaView>

      <HoliConfirmation
        show={showLoginConfirmation}
        label={t('auth.login.needed.title')}
        title={t('auth.login.needed.title')}
        description={t('auth.login.needed.description')}
        onDismiss={() => setShowLoginConfirmation(false)}
        dismissText={t('auth.login.needed.dismiss')}
        testID="post-comment-login-needed"
      />
    </>
  )
}

const COMMENT_BUTTON_CONTAINER_HEIGHT = 74

const styles = StyleSheet.create({
  commentsView: {
    paddingTop: 20,
    paddingHorizontal: 20,
    ...Platform.select({
      web: {
        paddingBottom: 120,
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
  postCommentButton: {
    width: '100%',
    height: COMMENT_BUTTON_CONTAINER_HEIGHT,
    ...Platform.select({
      web: {
        position: 'fixed',
        bottom: 0,
      },
    }),
  },
})

export default memo(PostDetailPage)
