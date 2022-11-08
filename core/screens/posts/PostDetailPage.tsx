import { useLazyQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import CommentConnector from '@holi/core/screens/comments/CommentConnector'
import CommentView from '@holi/core/screens/comments/CommentView'
import PostCommentButton from '@holi/core/screens/comments/PostCommentButton'
import { Comment } from '@holi/core/screens/comments/types'
import PostDetail from '@holi/core/screens/posts/PostDetail'
import { PostById, PostByIdResponse } from '@holi/core/screens/posts/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostDetailPageParams = {
  insightId: string
  postId: string
}

const { useParam } = createParam<PostDetailPageParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const getPostCommenters = (comments: Comment[]) => {
  const commenters = comments?.map((comment) => comment.commenter) || []

  // remove duplicates
  return commenters.filter(
    (user, index, self) => !!user && self.findIndex((commenter) => commenter.id === user.id) === index
  )
}

const PostDetailPage: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const [insightId] = useParam('insightId')
  const [postId] = useParam('postId')
  const { navigate } = useRouting()

  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const isWeb = Platform.OS === 'web'

  const [getPost, { loading, error, data }] = useLazyQuery<PostByIdResponse>(PostById, {
    variables: { id: postId },
  })

  const title = data?.postById?.title
  useNavigationHeader(navigation, { title: title, headerLeft: () => <BackButton /> })

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
      <DefaultLayout style={{ paddingBottom: 0 }}>
        <PostDetail post={post} />

        {/* Post comments */}
        {comments.length > 0 && (
          <View style={[mixins.container, styles.commentsView]}>
            <HoliUserAvatarPile users={commenters} usersToShow={3} collapse>
              {t('insights.post.response', { count: comments.length })}
            </HoliUserAvatarPile>

            <CommentConnector style={styles.commentConnector} />

            {comments.map((comment) => (
              <CommentView key={comment.id} comment={comment} style={styles.comment} />
            ))}
          </View>
        )}
      </DefaultLayout>

      <PostCommentButton
        style={[styles.postCommentButton, isWeb && mixins.container]}
        onPress={() => navigate(`/insights/${insightId}/posts/${post.id}/comment`)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  commentsView: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 60,
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
    position: 'fixed',
    bottom: 0,
  },
})

export default PostDetailPage
