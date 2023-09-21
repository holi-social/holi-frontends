import { useMutation, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { PortalGate } from '@holi/core/provider/PortalProvider'
import PostContent from '@holi/core/screens/posts/components/PostContent'
import VerticalLine from '@holi/core/screens/posts/components/VerticalLine'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import { CreatePostCommentMutation, CreatePostCommentResponse } from '@holi/core/screens/posts/queries'
import { PostById, PostByIdResponse } from '@holi/core/screens/posts/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import type { InsightsScreens } from '@holi/mobile/navigation/InsightsNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'
import { useKeyboard } from '@holi/ui/helper'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CommentInputPageParams = {
  insightId?: string
  spaceIdOrName?: string
  postId: string
}

type ScreenProps = NativeStackScreenProps<InsightsScreens>

const CommentInputPage: React.VFC<ScreenProps> = () => {
  const { useParam } = createParam<CommentInputPageParams>()
  const [insightId = ''] = useParam('insightId')
  const [spaceIdOrName = ''] = useParam('spaceIdOrName')
  const [postId] = useParam('postId')
  const [text, setText] = useState('')
  const [scrollContentHeight, setScrollContentHeight] = useState(0)
  const [maxViewPortHeight, setMaxViewPortHeight] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const { navigate, navigateBack } = useRouting()
  const { keyboardHeight } = useKeyboard()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { openToast } = useToast()
  const { user } = useLoggedInUser()
  const { height: screenHeight } = useWindowDimensions()
  const setScreenOptions = useSetScreenOptions()
  const styles = useMemo(() => getStyles(screenHeight), [screenHeight])
  const { displayError } = useErrorHandling()

  const { loading, error, data } = useQuery<PostByIdResponse>(PostById, {
    variables: { id: postId },
    onError: (error) => logError(error, 'Failed to load post', { location: 'CommentInputPage.PostById', postId }),
  })

  const [createPostComment, { loading: createCommentLoading }] = useMutation<CreatePostCommentResponse>(
    CreatePostCommentMutation,
    {
      onCompleted: () => {
        openToast(t('insights.posts.comments.success'), HoliToastType.SUCCESS)
        navigateBack()
      },
      onError: (error) =>
        displayError(error, 'Failed to create post comment', {
          location: 'CommentInputPage.createPostComment',
          postId,
          insightId,
          spaceIdOrName,
        }),
    }
  )

  useLayoutEffect(
    () =>
      setScreenOptions({
        title: t('insights.posts.comments.title'),
        headerStyle: { backgroundColor: colors.background10 },
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setScreenOptions, t]
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
      const paddingTop = screenHeight < SMALL_DEVICE_HEIGHT ? 50 : 20
      if (scrollContentHeight <= 0) return
      requestAnimationFrame(() =>
        scrollViewRef.current?.scrollTo({
          animated: true,
          y:
            scrollContentHeight -
            keyboardHeight -
            SUGGESTIONS_DROPDOWN_HEIGHT +
            SUBMIT_BUTTON_CONTAINER_HEIGHT -
            paddingTop,
        })
      )
    }
  }, [scrollContentHeight, keyboardHeight, screenHeight])

  useEffect(scrollIntoView, [scrollContentHeight, scrollIntoView])
  useEffect(scrollIntoView, [maxViewPortHeight, scrollIntoView])

  const onHeightChange = useCallback((newContainerHeight: number) => {
    const newScrollViewHeight = newContainerHeight - SUBMIT_BUTTON_CONTAINER_HEIGHT
    setMaxViewPortHeight(newScrollViewHeight)
  }, [])

  if (loading || error) {
    return <></>
  }

  if (!user) {
    navigate(`${getPostUrl(postId, insightId, spaceIdOrName)}`)
    return null
  }

  const post = data?.postById

  if (!post) return <HoliText>{t('insights.post.notFound', { postId })}</HoliText>

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.pageView}>
      <SafeAreaView style={styles.safeArea}>
        <HoliKeyboardSaveView onHeightChange={onHeightChange}>
          <ScrollView onContentSizeChange={scrollIntoView} ref={scrollViewRef} style={styles.scrollView}>
            <View
              onLayout={(event) => setScrollContentHeight(event.nativeEvent?.layout?.height)}
              style={styles.scrollContent}
            >
              {/* Post content */}
              <PostContent post={post} style={styles.postAndComments} />

              {/* Comment input block */}
              <View style={mixins.container}>
                <VerticalLine style={styles.verticalLine} />

                <View style={styles.inputContainer}>
                  <HoliAvatar
                    imageSrc={user.avatar}
                    imageBlurhash={user.avatarBlurhash}
                    label={user.fullName || t('user.profileView.anonymous')}
                    initials={user.avatarLabel || ''}
                    defaultColor={user.avatarDefaultColor || ''}
                    size="small"
                  />
                  <HoliRichTextInput
                    placeholder={t('insights.posts.comments.placeholder')}
                    autofocus={true}
                    onChange={setText}
                    style={styles.textInput}
                    testID="post-comment"
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Bar */}
          <View style={[styles.bottomBar]}>
            {/* Suggestions*/}
            <PortalGate gateName="suggestions" style={[styles.suggestionsScrollView]} />

            <View style={[styles.buttonContainer, mixins.container]}>
              <HoliButton
                disabled={!text.trim().length || createCommentLoading}
                label={t('insights.posts.comments.button')}
                variant="small"
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
          </View>
        </HoliKeyboardSaveView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const SUBMIT_BUTTON_CONTAINER_HEIGHT = 64
const SUGGESTIONS_DROPDOWN_HEIGHT = 150
const SMALL_DEVICE_HEIGHT = 600

const getStyles = (screenHeight: number) =>
  StyleSheet.create({
    pageView: {
      paddingTop: vars.topBarHeight + 40,
      height: '100%', // prevents double scrollbars
      overflow: 'hidden',
      ...Platform.select({
        web: {
          paddingTop: vars.topBarHeight + 10,
          height: '100vh',
          marginHorizontal: 'auto',
        },
        android: {
          paddingBottom: 0,
        },
      }),
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background10,
    },
    scrollView: {
      flex: 1,
      width: '100%',
      maxWidth: vars.maxScreenWidth,
      marginHorizontal: 'auto',
    },
    scrollContent: {
      paddingBottom: SUGGESTIONS_DROPDOWN_HEIGHT + SUBMIT_BUTTON_CONTAINER_HEIGHT + 50,
      ...Platform.select({
        web: {
          paddingBottom:
            screenHeight > SMALL_DEVICE_HEIGHT
              ? SUGGESTIONS_DROPDOWN_HEIGHT
              : SUGGESTIONS_DROPDOWN_HEIGHT - SUBMIT_BUTTON_CONTAINER_HEIGHT,
        },
      }),
    },
    postAndComments: {
      marginTop: 12,
    },
    verticalLine: {
      marginTop: 16,
      marginBottom: 10,
      marginHorizontal: 20,
      minHeight: 50,
      ...Platform.select({ web: { minHeight: 75 } }),
    },
    inputContainer: {
      marginTop: 16,
      lineHeight: 22,
      flexDirection: 'row',
    },
    textInput: {
      flex: 1,
      marginLeft: 10,
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
      width: '100%',
      borderTopWidth: 1,
      borderTopColor: colors.background30,
      backgroundColor: colors.background10,
      ...Platform.select({
        web: {
          position: 'relative',
        },
      }),
    },
    suggestionsScrollView: {
      zIndex: screenHeight < SMALL_DEVICE_HEIGHT ? 3 : undefined,
      width: '100%',
      height: SUGGESTIONS_DROPDOWN_HEIGHT,
      maxHeight: SUGGESTIONS_DROPDOWN_HEIGHT,
      paddingTop: 10,
      marginBottom: screenHeight < SMALL_DEVICE_HEIGHT ? -75 : -10,
      paddingBottom: 10,
      backgroundColor: colors.background10,
      shadowColor: colors.foreground30,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      borderRadius: 12,
      elevation: 4,
      borderTopWidth: 1,
      borderTopColor: colors.background30,
      ...Platform.select({
        web: {
          maxWidth: vars.maxScreenWidth,
          marginHorizontal: 'auto',
        },
      }),
      position: 'absolute',
      bottom: SUBMIT_BUTTON_CONTAINER_HEIGHT,
      left: 0,
      right: 0,
    },
    buttonContainer: {
      width: '100%',
      zIndex: 2,
      justifyContent: 'center',
      alignItems: 'flex-end',
      height: SUBMIT_BUTTON_CONTAINER_HEIGHT,
      ...Platform.select({
        web: {
          maxWidth: vars.maxScreenWidth,
          marginHorizontal: 'auto',
        },
      }),
    },
  })

export default withProfiler(memo(CommentInputPage), { name: 'CommentInputPage' })
