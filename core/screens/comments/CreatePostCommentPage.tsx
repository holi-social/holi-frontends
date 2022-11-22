import { useMutation, useQuery } from '@apollo/client'
import React, { memo, useContext, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { logError } from '@holi/core/errors/helpers'
import { userFullName } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import CommentConnector from '@holi/core/screens/comments/components/CommentConnector'
import { CreatePostCommentMutation, CreatePostCommentResponse } from '@holi/core/screens/comments/queries'
import PostDetail from '@holi/core/screens/posts/components/PostDetail'
import { PostById, PostByIdResponse } from '@holi/core/screens/posts/queries'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import HoliRichInput from '@holi/ui/components/organisms/HoliRichTextInput'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CreatePostCommentPageParams = {
  insightId: string
  postId: string
}

type ScreenProps = NativeStackScreenProps<HomeStackScreens> & { style?: StyleProp<ViewStyle> }

const CreatePostCommentPage: React.VFC<ScreenProps> = ({ style }: ScreenProps) => {
  const isWeb = Platform.OS === 'web'

  const [text, setText] = useState('')
  const { useParam } = createParam<CreatePostCommentPageParams>()
  const [insightId] = useParam('insightId')
  const [postId] = useParam('postId')
  const scrollViewRef = useRef<ScrollView>(null)
  const { navigate, navigateBack } = useRouting()

  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { openToast } = useToast()

  const { user } = useContext(UserContext)

  const { loading, error, data } = useQuery<PostByIdResponse>(PostById, {
    variables: { id: postId },
  })

  const [createPostComment, { loading: createCommentLoading, error: createCommentError }] =
    useMutation<CreatePostCommentResponse>(CreatePostCommentMutation, {
      onCompleted: () => {
        openToast(t('insights.posts.comments.success'), HoliToastType.SUCCESS)
        navigateBack()
      },
      onError: () => openToast(t('insights.posts.comments.error'), HoliToastType.ERROR),
    })

  const { setOptions } = useUnifiedNavigation()

  useLayoutEffect(
    () =>
      setOptions({
        title: t('insights.posts.comments.title'),
        headerStyle: { backgroundColor: colors.backgroundColorWhite },
      }),
    [setOptions, t]
  )

  if (createCommentError) {
    logError(createCommentError, `[CreatePostCommentPage.tsx] ${createCommentError.message}`)
  }

  if (error) {
    logError(error, `[CreatePostCommentPage.tsx] ${error.message}`)
  }

  if (loading || error) {
    return <></>
  }

  if (!user) {
    navigate(`/insights/${insightId}/posts/${postId}`)
    return null
  }

  const post = data?.postById

  if (!post) return <HoliText>{t('insights.post.notFound', { postId })}</HoliText>

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar animated />
      <SafeAreaView style={styles.wrapper}>
        <ScrollView
          ref={scrollViewRef}
          onLayout={() => scrollViewRef.current?.scrollToEnd()}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Post content */}
          <PostDetail post={post} />

          {/* Comment input block */}
          <View style={[mixins.container, styles.inputWrapper, style]}>
            <CommentConnector style={styles.commentConnector} />

            <View style={styles.inputContainer}>
              <HoliUserAvatar
                imageSrc={user.avatar}
                label={userFullName(user)}
                initials={user.avatarLabel || ''}
                defaultColor={user.avatarDefaultColor || ''}
                size="small"
              />
              <HoliRichInput
                placeholder={t('insights.posts.comments.placeholder')}
                autofocus
                onChange={setText}
                style={styles.textInput}
                testID="post-comment-input"
              />
            </View>
          </View>
        </ScrollView>
        <View style={[styles.bottomBar, isWeb && mixins.container]}>
          <HoliButton
            disabled={!text.trim().length || createCommentLoading}
            label={t('insights.posts.comments.button')}
            inline
            onPress={() =>
              createPostComment({
                variables: {
                  input: { postId, text: text.trim() },
                },
              })
            }
            testID="btn-submit-comment"
          >
            {t('insights.posts.comments.button')}
          </HoliButton>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
  },
  inputWrapper: {
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
  },
  inputContainer: {
    marginTop: 16,
    lineHeight: 22,
    flexDirection: 'row',
  },
  commentConnector: {
    marginTop: 16,
    marginBottom: 10,
    marginHorizontal: 20,
    minHeight: 50,
    ...Platform.select({ web: { minHeight: 75 } }),
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    marginBottom: '20%',
    // space below for 5 suggestions
    ...Platform.select({ ios: { marginTop: 5 } }),
    ...Platform.select({
      web: {
        minHeight: 200,
        marginLeft: 18,
      },
    }),
  },
  bottomBar: {
    bottom: 0,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderColorGrey,
    backgroundColor: colors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',

    ...Platform.select({
      web: {
        position: 'fixed',
        textAlign: 'center',
        paddingBottom: 78,
      },
    }),
  },
})

export default memo(CreatePostCommentPage)
