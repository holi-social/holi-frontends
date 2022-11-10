import { useMutation, useQuery } from '@apollo/client'
import React, { useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native'

import { useHeaderHeight } from '@react-navigation/elements'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { logError } from '@holi/core/errors/helpers'
import { userFullName } from '@holi/core/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
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
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CreatePostCommentPageParams = {
  insightId: string
  postId: string
}

type ScreenProps = NativeStackScreenProps<HomeStackScreens> & { style?: StyleProp<ViewStyle> }

const CreatePostCommentPage: React.VFC<ScreenProps> = ({ navigation, style }: ScreenProps) => {
  const isWeb = Platform.OS === 'web'

  // useHeaderHeight may not be used for web, and for web its value can be zero since it doesn't depend on KeyboardAvoidingView
  const getHeaderHeight = isWeb ? () => 0 : useHeaderHeight

  const [text, setText] = useState('')
  const { useParam } = createParam<CreatePostCommentPageParams>()
  const [insightId] = useParam('insightId')
  const [postId] = useParam('postId')
  const scrollViewRef = useRef<ScrollView>(null)
  const { navigate } = useRouting()

  const headerHeight = getHeaderHeight()

  const statusBarHeight = Platform.OS === 'ios' ? 20 : 0 // https://github.com/react-navigation/react-navigation/issues/3971

  const keyboardAvoidingViewVerticalOffset = headerHeight + statusBarHeight

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
        navigate(`/insights/${insightId}/posts/${postId}`)
      },
      onError: () => openToast(t('insights.posts.comments.error'), HoliToastType.ERROR),
    })

  useNavigationHeader(navigation, { title: t('insights.posts.comments.title'), headerLeft: () => <BackButton /> })

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

  const handleTextChange = (inputText: string) => {
    setText(inputText)
  }

  return (
    <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={keyboardAvoidingViewVerticalOffset}>
      <StatusBar animated />
      <View style={styles.wrapper}>
        <ScrollView ref={scrollViewRef} onLayout={() => scrollViewRef.current?.scrollToEnd()}>
          {/* Post content */}
          <PostDetail post={post} />

          {/* Create comment block */}

          <View style={[mixins.container, styles.inputWrapper, style]}>
            <CommentConnector style={styles.commentConnector} />

            <View style={styles.body}>
              <HoliUserAvatar
                imageSrc={user.avatar}
                label={userFullName(user)}
                initials={user.avatarLabel || ''}
                defaultColor={user.avatarDefaultColor || ''}
                size="small"
              />

              {/* Mobile version */}
              {!isWeb && (
                <TextInput
                  autoFocus
                  onChangeText={handleTextChange}
                  style={styles.textInput}
                  placeholder={t('insights.posts.comments.placeholder')}
                  placeholderTextColor={colors.fontColorGrey}
                  textAlignVertical="top"
                  multiline
                >
                  <HoliText style={[styles.text, (!text && styles.placeholder) || {}]}>{text}</HoliText>
                </TextInput>
              )}

              {/* Web version */}
              {isWeb && (
                <TextInput
                  onChangeText={handleTextChange}
                  style={styles.textInput}
                  placeholder={t('insights.posts.comments.placeholder')}
                  placeholderTextColor={colors.fontColorGrey}
                  textAlignVertical="top"
                  multiline
                  value={text}
                />
              )}
            </View>
          </View>
        </ScrollView>
        <View style={[styles.bottomBar, isWeb && mixins.container]}>
          <HoliButton
            disabled={!text || createCommentLoading}
            label={t('insights.posts.comments.button')}
            inline
            onPress={() =>
              createPostComment({
                variables: {
                  input: { postId, text },
                },
              })
            }
          >
            {t('insights.posts.comments.button')}
          </HoliButton>
        </View>
      </View>
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
  commentConnector: {
    marginTop: 16,
    marginBottom: 10,
    marginHorizontal: 20,
    minHeight: 50,
    ...Platform.select({ web: { minHeight: 75 } }),
  },
  body: {
    marginTop: 16,
    lineHeight: 22,
    flexDirection: 'row',
    minHeight: 200,
    paddingBottom: 100,
  },
  textInput: {
    marginLeft: 18,
    paddingVertical: 10,
    flex: 1,
    ...Platform.select({
      web: {
        minHeight: 200,
      },
    }),
  },
  text: {
    lineHeight: 20,
  },
  placeholder: {
    color: colors.fontColorGrey,
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
        paddingBottom: 65,
      },
    }),
  },
})

export default CreatePostCommentPage
