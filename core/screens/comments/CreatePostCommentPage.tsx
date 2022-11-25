import { useMutation, useQuery } from '@apollo/client'
import React, { memo, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { logError } from '@holi/core/errors/helpers'
import { useKeyboard } from '@holi/core/helpers'
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

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const CreatePostCommentPage: React.VFC<ScreenProps> = () => {
  const { useParam } = createParam<CreatePostCommentPageParams>()
  const [insightId] = useParam('insightId')
  const [postId] = useParam('postId')
  const [text, setText] = useState('')
  const [scrollContentHeight, setScrollContentHeight] = useState(0)
  const [bottomPadding, setBottomPadding] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const { navigate, navigateBack } = useRouting()
  const { keyboardHeight } = useKeyboard()
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

  /**
   * The view should:
   * - scroll input field into viewport (with open keyboard)
   * - scroll down when input field increases
   * - leave scrolling space to show 5 suggestions below
   * - prevent double scrollbars in web (no main page scrolling)
   */
  const scrollIntoView = useCallback(() => {
    if (Platform.OS === 'web') {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    } else {
      // TODO: calculate 300 px !!
      scrollViewRef.current?.scrollTo({
        animated: true,
        y: scrollContentHeight - 300,
      })
    }
  }, [scrollContentHeight])

  useEffect(() => {
    if (Platform.OS === 'web') {
      setBottomPadding(keyboardHeight)
    } else {
      // TODO: calculate 250 px (SUGGESTIONS_DROPDOWN_HEIGHT + BOTTOM_BAR_HEIGHT) ?!
      setBottomPadding(keyboardHeight + 250)
    }
  }, [keyboardHeight])

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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        onContentSizeChange={scrollIntoView}
        ref={scrollViewRef}
      >
        <View onLayout={(event) => setScrollContentHeight(event.nativeEvent?.layout?.height)}>
          {/* Post content */}
          <PostDetail post={post} />

          {/* Comment input block */}
          <View style={mixins.container}>
            <CommentConnector style={styles.commentConnector} />

            <View style={styles.inputContainer}>
              <HoliUserAvatar
                imageSrc={user.avatar}
                label={user.fullName}
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
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, Platform.OS === 'web' && mixins.container]}>
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
    </KeyboardAvoidingView>
  )
}

const HEADER_HEIGHT = 52
const FOOTER_HEIGHT = 66
const BOTTOM_BAR_HEIGHT = 74
const SUGGESTIONS_DROPDOWN_HEIGHT = 200

const styles = StyleSheet.create({
  root: {
    paddingTop: HEADER_HEIGHT,
    height: '100%', // prevents double scrollbars
    ...Platform.select({ web: { height: '100vh' } }),
    paddingBottom: FOOTER_HEIGHT + BOTTOM_BAR_HEIGHT,
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
    marginBottom: SUGGESTIONS_DROPDOWN_HEIGHT,
    ...Platform.select({
      web: {
        marginLeft: 18,
      },
      ios: {
        marginTop: 5,
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
        // bottom nav is only visible in web
        position: 'fixed',
        bottom: FOOTER_HEIGHT,
      },
    }),
  },
})

export default memo(CreatePostCommentPage)
