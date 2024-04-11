import { useMutation } from '@apollo/client'
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DimensionValue,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'

import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { PortalGate } from '@holi/core/providers/PortalProvider'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import { AddCommentMutation, CreateCommentResponse } from '@holi/core/screens/comments/mutations'
import { CommentableType } from '@holi/core/screens/comments/types'
import { PostById } from '@holi/core/screens/posts/queries'
import { User } from '@holi/core/screens/userprofile/types'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'
import Spacing from '@holi/ui/foundations/Spacing'
import { useKeyboard } from '@holi/ui/helper'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface CommentFormProps extends PropsWithChildren {
  commentableId: string
  commentableType: CommentableType
  user: User
}

const CommentForm = ({ commentableId, commentableType, user, children }: CommentFormProps) => {
  const [text, setText] = useState('')
  const [scrollContentHeight, setScrollContentHeight] = useState(0)
  const [maxViewPortHeight, setMaxViewPortHeight] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const { navigateBack, replaceRoute } = useRouting()
  const { keyboardHeight } = useKeyboard()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { openToast } = useToast()
  const { height: screenHeight } = useWindowDimensions()
  const { displayError } = useErrorHandling()

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(screenHeight, theme), [screenHeight, theme])

  const [addComment, { loading: createCommentLoading }] = useMutation<CreateCommentResponse>(AddCommentMutation, {
    onCompleted: () => {
      openToast(t('comments.success'), HoliToastType.SUCCESS)
      navigateBack()
    },
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      displayError(error, 'Failed to create comment', {
        location: 'CommentForm.createComment',
        commentableId,
      })
    },
    refetchQueries:
      commentableType === CommentableType.POST
        ? ['Comments', { query: PostById, variables: { id: commentableId }, fetchPolicy: 'network-only' }]
        : ['Comments'],
  })

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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.pageView}>
      <SafeAreaView style={styles.safeArea}>
        <HoliKeyboardSaveView onHeightChange={onHeightChange}>
          <ScrollView onContentSizeChange={scrollIntoView} ref={scrollViewRef} style={styles.scrollView}>
            <View
              onLayout={(event) => setScrollContentHeight(event.nativeEvent?.layout?.height)}
              style={styles.scrollContent}
            >
              {!!children && <View style={styles.childrenView}>{children}</View>}

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
                    placeholder={t('comments.placeholder')}
                    autofocus={true}
                    onChange={setText}
                    style={styles.textInput}
                    testID="post-comment"
                    showCharacterCount={true}
                    maxNoOfCharacters={1500}
                    maxSuggestionOptions={30}
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
                label={t('comments.button')}
                variant="small"
                inline
                onPress={() =>
                  addComment({
                    variables: {
                      input: {
                        text: text.trim(),
                        commentableId,
                        commentableType,
                      },
                    },
                  })
                }
                testID="btn-submit-comment"
              >
                {t('comments.button')}
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

const getStyles = (screenHeight: number, theme: HoliTheme) =>
  StyleSheet.create({
    pageView: {
      paddingTop: dimensions.topBarHeight + 40,
      height: '100%', // prevents double scrollbars
      overflow: 'hidden',
      ...Platform.select({
        web: {
          paddingTop: dimensions.topBarHeight + 10,
          height: '100vh' as DimensionValue,
          marginHorizontal: 'auto',
        },
        android: {
          paddingBottom: 0,
        },
      }),
    },
    childrenView: {
      marginTop: Spacing.xxs,
    },
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background10,
    },
    scrollView: {
      flex: 1,
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
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
      borderTopColor: theme.colors.background30,
      backgroundColor: theme.colors.background10,
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
      backgroundColor: theme.colors.background10,
      shadowColor: theme.colors.foreground30,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      borderRadius: 12,
      elevation: 4,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
      ...Platform.select({
        web: {
          maxWidth: dimensions.maxScreenWidth,
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
          maxWidth: dimensions.maxScreenWidth,
          marginHorizontal: 'auto',
        },
      }),
    },
  })

export default CommentForm
