import { useLazyQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { useKeyboard, userFullName } from '@holi/core/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import CommentConnector from '@holi/core/screens/comments/CommentConnector'
import CommentView from '@holi/core/screens/comments/CommentView'
import CreateCommentView from '@holi/core/screens/comments/CreateCommentView'
import PostCommentButton from '@holi/core/screens/comments/PostCommentButton'
import { PostById, PostByIdResponse } from '@holi/core/screens/posts/queries'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostDetailPageParams = {
  insightId: string
  postId: string
}

const { useParam } = createParam<PostDetailPageParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const PostDetailPage: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const [showTextInput, setShowTextInput] = useState(false)
  const [postId] = useParam('postId')
  const scrollView = useRef<ScrollView>(null)

  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { user } = useContext(UserContext)

  const { keyboardHeight } = useKeyboard()

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

  const author = {
    ...post.creator,
    fullName: userFullName(post.creator),
  }

  const comments = post.comments || []

  const commenters = comments?.map((comment) => comment.creator) || []

  if (keyboardHeight > 0) {
    scrollView.current?.scrollToEnd()
  }

  return (
    <>
      <KeyboardAvoidingView behavior="position">
        <StatusBar animated />
        <DefaultLayout ref={scrollView} style={{ paddingBottom: 0 }}>
          {/* Post content */}
          <View style={[mixins.container, styles.postView]}>
            {/* Post title */}
            <View style={styles.header}>
              <HoliHeading level="1" size="medium">
                {title}
              </HoliHeading>
              <HoliButton transparent inline label={t('insights.post.preview.more')} style={styles.moreButton}>
                <HoliIcon icon="more" color={colors.fontColorGrey} />
              </HoliButton>
            </View>

            {/* Post creator */}
            <HoliMediaHeader
              title={author.fullName}
              author={author}
              date={post.created}
              boldTitle
              style={styles.mediaHeader}
            />

            <HoliText style={styles.body}>{post.text}</HoliText>
          </View>

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
          {/* Create comment block */}
          {showTextInput && <CreateCommentView user={user} />}
        </DefaultLayout>
      </KeyboardAvoidingView>
      {!showTextInput && (
        <PostCommentButton
          onPress={() => {
            setShowTextInput(true)
            console.log('scrolling', scrollView.current)
            scrollView.current?.scrollToEnd()
          }}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  postView: {
    paddingTop: 12,
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
  },
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaHeader: {
    marginTop: 20,
  },
  body: {
    marginTop: 16,
    lineHeight: 22,
  },
  commentsView: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  commentConnector: {
    marginTop: 12,
    marginHorizontal: 20,
  },
  comment: {
    marginTop: 12,
  },
})

export default PostDetailPage
