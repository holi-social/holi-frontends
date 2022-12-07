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
import PostContent from '@holi/core/screens/posts/components/PostContent'
import VerticalLine from '@holi/core/screens/posts/components/VerticalLine'
import { CreatePostCommentMutation, CreatePostCommentResponse } from '@holi/core/screens/posts/queries'
import { PostById, PostByIdResponse } from '@holi/core/screens/posts/queries'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CommentInputPageParams = {
  insightId: string
  postId: string
}

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const CommentInputPage: React.VFC<ScreenProps> = () => {
  const { useParam } = createParam<CommentInputPageParams>()
  const [insightId] = useParam('insightId')
  const [postId] = useParam('postId')
  const [text, setText] = useState('')
  const [scrollContentHeight, setScrollContentHeight] = useState(0)
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
      const paddingTop = 20
      if (scrollContentHeight <= 0) return
      scrollViewRef.current?.scrollTo({
        animated: true,
        y: scrollContentHeight - SUGGESTIONS_DROPDOWN_HEIGHT - SUBMIT_BUTTON_CONTAINER_HEIGHT - paddingTop,
      })
    }
  }, [scrollContentHeight])

  useEffect(scrollIntoView, [scrollContentHeight, scrollIntoView])

  const bottomPadding =
    keyboardHeight + (Platform.OS === 'web' ? 0 : SUGGESTIONS_DROPDOWN_HEIGHT + SUBMIT_BUTTON_CONTAINER_HEIGHT)

  if (createCommentError) {
    logError(createCommentError, `[CommentInputPage.tsx] ${createCommentError.message}`)
  }

  if (error) {
    logError(error, `[CommentInputPage.tsx] ${error.message}`)
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
          <PostContent post={post} hasHeader minimized style={styles.postContent} />

          {/* Comment input block */}
          <View style={mixins.container}>
            <VerticalLine style={styles.verticalLine} />

            <View style={styles.inputContainer}>
              <HoliUserAvatar
                imageSrc={user.avatar}
                label={user.fullName}
                initials={user.avatarLabel || ''}
                defaultColor={user.avatarDefaultColor || ''}
                size="small"
              />
              <HoliRichTextInput
                placeholder={t('insights.posts.comments.placeholder')}
                autofocus
                onChange={setText}
                style={styles.textInput}
                testID="post-comment"
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

const SUBMIT_BUTTON_CONTAINER_HEIGHT = 74
const SUGGESTIONS_DROPDOWN_HEIGHT = 200

const styles = StyleSheet.create({
  root: {
    paddingTop: vars.topBarHeight,
    paddingBottom: vars.bottomBarHeight + SUBMIT_BUTTON_CONTAINER_HEIGHT,
    height: '100%', // prevents double scrollbars
    ...Platform.select({
      web: { height: '100vh' },
      android: {
        paddingBottom: 0,
      },
    }),
  },
  postContent: {
    marginTop: 12,
  },
  inputContainer: {
    marginTop: 16,
    lineHeight: 22,
    flexDirection: 'row',
  },
  verticalLine: {
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
    height: SUBMIT_BUTTON_CONTAINER_HEIGHT,
    ...Platform.select({
      web: {
        // bottom nav is only visible in web
        position: 'fixed',
        bottom: vars.bottomBarHeight,
      },
    }),
  },
})

export default memo(CommentInputPage)
