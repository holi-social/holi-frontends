import { useMutation, useQuery } from '@apollo/client'
import React, {
  SyntheticEvent,
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { logError } from '@holi/core/errors/helpers'
import { useKeyboard } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { PortalGate } from '@holi/core/provider/PortalProvider'
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
import { useDebounce } from '@holi/ui/helper/useDebounce'
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
  const [bottomBarDiff, setBottomBarDiff] = useState(0)
  const [lastWindowHeight, setLastWindowHeight] = useState(0)
  const [LastKeyboardOpen, setLastKeyboardOpen] = useState<boolean>()
  const [scrollContentHeight, setScrollContentHeight] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const { navigate, navigateBack } = useRouting()
  const { keyboardHeight } = useKeyboard()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { openToast } = useToast()
  const { user } = useContext(UserContext)
  const { height: screenHeight } = useWindowDimensions()
  const styles = useMemo(() => getStyles(screenHeight), [screenHeight])

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
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, t]
  )

  const checkKeyboardOpen = useCallback(
    (event: SyntheticEvent<Event> | null) => {
      const viewPortHeight = event ? event.target?.height : window?.visualViewport?.height
      const windowHeight = window?.innerHeight
      let keyboardIsOpen = windowHeight > viewPortHeight

      const stateHasChanged = keyboardIsOpen !== LastKeyboardOpen
      const windowHeightHasChanged = windowHeight !== lastWindowHeight

      if (keyboardIsOpen) {
        if (!stateHasChanged && windowHeightHasChanged && viewPortHeight !== windowHeight) {
          keyboardIsOpen = false
        }
      } else if (!keyboardIsOpen) {
        if (!stateHasChanged && windowHeightHasChanged) {
          keyboardIsOpen = true
        }
      }
      setLastWindowHeight(windowHeight)
      setLastKeyboardOpen(keyboardIsOpen)
    },
    [LastKeyboardOpen, lastWindowHeight]
  )

  const viewportHandler = useDebounce((event: SyntheticEvent<Event> | null) => {
    if (!LastKeyboardOpen) return setBottomBarDiff(0)

    const viewPortHeight = event ? event.target?.height : window?.visualViewport?.height
    const windowHeight = window?.innerHeight

    const viewPortOffset = event ? event.target?.offsetTop : window?.visualViewport?.offsetTop
    // const bodyOffset = window?.document?.body?.getBoundingClientRect?.()?.top

    const tooDeep = viewPortHeight < windowHeight
    const tooHeigh = viewPortOffset > windowHeight
    const heightDiff = windowHeight - viewPortHeight
    const newPosition = heightDiff

    if (tooHeigh) {
      setBottomBarDiff(0)
    } else if (tooDeep) {
      setBottomBarDiff(newPosition)
    } else {
      setBottomBarDiff(0)
    }
  }, 100)

  const onResize = useDebounce((event) => {
    checkKeyboardOpen(event)
    viewportHandler(event)
  }, 100)

  const onScroll = useDebounce((event) => {
    viewportHandler(event)
  }, 100)

  useEffect(() => {
    window?.visualViewport?.addEventListener('scroll', onScroll)
    window?.visualViewport?.addEventListener('resize', onResize)
    return () => {
      window?.visualViewport?.removeEventListener('scroll', onScroll)
      window?.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [onScroll, onResize])

  /**
   * The view should:
   * - scroll input field into viewport (with open keyboard)
   * - scroll down when input field increases
   * - leave scrolling space to show 5 suggestions below
   * - prevent double scrollbars in web (no main page scrolling)
   */
  const scrollIntoView = useCallback(() => {
    if (Platform.OS === 'web') {
      const scrollViewHeight = scrollViewRef.current?.offsetHeight
      if (scrollViewHeight) {
        setTimeout(
          () =>
            scrollViewRef.current?.scrollTo({
              animated: true,
              y: scrollViewHeight - SUGGESTIONS_DROPDOWN_HEIGHT,
            }),
          10
        )
      } else {
        scrollViewRef.current?.scrollToEnd({ animated: true })
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 10)
      }
    } else {
      const paddingTop = screenHeight < SMALL_DEVICE_HEIGHT ? 50 : 20
      if (scrollContentHeight <= 0) return
      setImmediate(() =>
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.pageView]}>
      <ScrollView onContentSizeChange={scrollIntoView} ref={scrollViewRef} style={styles.scrollView}>
        <View
          onLayout={(event) => setScrollContentHeight(event.nativeEvent?.layout?.height)}
          style={styles.scrollContent}
        >
          {/* Post content */}
          <PostContent post={post} hasHeader minimized style={styles.postAndComments} />

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
      <View style={[styles.bottomBar, { bottom: bottomBarDiff }]}>
        {/* Suggestions*/}
        <PortalGate gateName="suggestions" style={[styles.suggestionsScrollView]} />

        <View style={[styles.buttonContainer, Platform.OS === 'web' && mixins.container]}>
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
    </KeyboardAvoidingView>
  )
}

const SUBMIT_BUTTON_CONTAINER_HEIGHT = 64
const SUGGESTIONS_DROPDOWN_HEIGHT = 150
const SMALL_DEVICE_HEIGHT = 600

const getStyles = (screenHeight: number) =>
  StyleSheet.create({
    pageView: {
      paddingTop: vars.topBarHeight + 10,
      height: '100%', // prevents double scrollbars
      overflow: 'hidden',
      ...Platform.select({
        web: {
          height: '100vh',
          marginHorizontal: 'auto',
        },
        android: {
          paddingBottom: 0,
        },
      }),
    },
    scrollView: {
      flex: 1,
      maxWidth: vars.maxScreenWidth,
      marginHorizontal: 'auto',
    },
    scrollContent: {
      paddingBottom: SUGGESTIONS_DROPDOWN_HEIGHT + SUBMIT_BUTTON_CONTAINER_HEIGHT + 50,
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
      ...Platform.select({
        web: {
          position: 'fixed',
          bottom: 0,
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
      backgroundColor: colors.backgroundColor,
      shadowColor: colors.shadowColorBlack,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      borderRadius: 12,
      elevation: 4,
      borderTopWidth: 1,
      borderTopColor: colors.borderColorGrey,
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
      borderTopWidth: 1,
      borderTopColor: colors.borderColorGrey,
      backgroundColor: colors.backgroundColor,
      ...Platform.select({
        web: {
          maxWidth: vars.maxScreenWidth,
          marginHorizontal: 'auto',
        },
      }),
    },
  })

export default memo(CommentInputPage)
