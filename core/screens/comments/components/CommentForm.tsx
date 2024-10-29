import { useLazyQuery, useMutation } from '@apollo/client'
import * as Notifications from 'expo-notifications'
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'
import { LayoutChangeEvent } from 'react-native'

import { User } from '@holi/core/domain/shared/types'
import { isMaliciousUrlError, isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { PortalGate } from '@holi/core/providers/PortalProvider'
import { DetectLanguageQueryResponse, detectLanguageQuery } from '@holi/core/queries'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import { AddCommentMutation, CreateCommentResponse } from '@holi/core/screens/comments/mutations'
import { commentsByCommentable, commentsMetadata } from '@holi/core/screens/comments/queries'
import { Comment, CommentableType } from '@holi/core/screens/comments/types'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import NotificationOptInModal from '@holi/core/screens/notifications/components/NotificationOptInModal'
import {
  incrementModalAttempts,
  useNotificationEligibility,
} from '@holi/core/screens/notifications/helpers/notificationModalHelper'
import { PostById } from '@holi/core/screens/posts/queries'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface CommentFormProps extends PropsWithChildren {
  commentableId: string
  commentableType: CommentableType
  user: User
  parentComment?: Comment
  redirectRoute?: string
}

const CommentForm = ({
  commentableId,
  commentableType,
  user,
  parentComment,
  redirectRoute,
  children,
}: CommentFormProps) => {
  const [text, setText] = useState('')
  const { navigateBack, replaceRoute } = useRouting()
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { height: screenHeight } = useWindowDimensions()
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const [scrollContentHeight, setScrollContentHeight] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(screenHeight, theme), [screenHeight, theme])

  const commonQueries = [
    {
      query: commentsByCommentable,
      variables: { commentableId, commentableType },
      fetchPolicy: 'network-only',
    },
    {
      query: commentsMetadata,
      variables: { commentableId, commentableType },
      fetchPolicy: 'network-only',
    },
  ]

  const refetchQueriesMap = {
    [CommentableType.POST]: [
      { query: lastInsightsQuery },
      {
        query: PostById,
        variables: { id: commentableId },
        fetchPolicy: 'network-only',
      },
      ...commonQueries,
    ],
    [CommentableType.DISCUSSION]: [{ query: lastInsightsQuery }, ...commonQueries],
  }

  const { isEligible } = useNotificationEligibility()
  const [modalVisible, setModalVisible] = useState(false)

  // @ts-ignore
  const refetchQueries = refetchQueriesMap[commentableType] || commonQueries

  const handleNavigation = () => {
    if (redirectRoute) {
      replaceRoute(redirectRoute)
    } else {
      navigateBack()
    }
  }

  const [addComment, { loading: createCommentLoading }] = useMutation<CreateCommentResponse>(AddCommentMutation, {
    onCompleted: async () => {
      openToast(t('comments.success'), HoliToastType.SUCCESS)
      track(TrackingEvent.Engaging.commented(commentableType, commentableId))

      // Check if the user has already granted notification permissions
      const { status } = await Notifications.getPermissionsAsync()
      const shouldShowModal = status !== 'granted' && isEligible

      if (!shouldShowModal) {
        handleNavigation()
      } else {
        setModalVisible(true)
      }
    },
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        if (isNotFoundError(error)) {
          return replaceRoute('/404')
        }
        displayError(error, 'Failed to create comment', {
          location: 'CommentForm.createComment',
          commentableId,
        })
      }
    },
    refetchQueries,
  })

  const [detectLanguage, { loading: detectLanguageLoading }] =
    useLazyQuery<DetectLanguageQueryResponse>(detectLanguageQuery)

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [scrollContentHeight])

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setScrollContentHeight(event.nativeEvent.layout.height)
    },
    [setScrollContentHeight]
  )

  const onKeyboardDidShow = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [])

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow')
    }
  }, [onKeyboardDidShow])

  const handleCommentSubmit = async () => {
    const data = await detectLanguage({ variables: { text: text.trim() } })

    await addComment({
      variables: {
        input: {
          text: text.trim(),
          commentableId,
          commentableType,
          parentCommentId: parentComment?.id,
          language: data?.data?.detectedLanguage,
        },
      },
    })
  }

  const handleOptIn = async () => {
    const { status } = await Notifications.getPermissionsAsync()
    const openSettings = () => Linking.openURL('app-settings:')

    await incrementModalAttempts()

    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync()

      if (newStatus === 'granted') {
        setModalVisible(false)
        handleNavigation()
      } else if (newStatus === 'undetermined') {
        // Do nothing, keep the modal open
      } else {
        openSettings()
        setModalVisible(false)
        handleNavigation()
      }
    } else {
      setModalVisible(false)
      handleNavigation()
    }
  }

  const handleModalDismiss = async () => {
    setModalVisible(false)
    await incrementModalAttempts()
    redirectRoute ? replaceRoute(redirectRoute) : navigateBack()
  }

  return (
    <View style={styles.safeArea}>
      <HoliContainer noPadding>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.pageView}>
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            ref={scrollViewRef}
            contentContainerStyle={styles.content}
          >
            <View>
              {children}

              {/* Comment input block */}
              <HoliContainer>
                {!parentComment && <VerticalLine style={styles.verticalLine} />}

                <View style={styles.inputContainer}>
                  <HoliAvatar
                    imageSrc={user.avatar}
                    imageBlurhash={user.avatarBlurhash}
                    label={user.fullName || t('user.profileView.anonymous')}
                    initials={user.avatarLabel || ''}
                    defaultColor={user.avatarDefaultColor || ''}
                    size={parentComment ? 'micro' : 'small'}
                  />
                  <HoliRichTextInput
                    onLayout={onLayout}
                    placeholder={t('comments.placeholder')}
                    autofocus={true}
                    onChange={setText}
                    style={styles.textInput}
                    testID="post-comment"
                    showCharacterCount={true}
                    maxNoOfCharacters={1500}
                    maxSuggestionOptions={30}
                    // initialValue is not yet supported on web
                    {...(Platform.OS !== 'web' && parentComment && parentComment?.creator?.id !== user?.id
                      ? {
                          initialValue: ' ', // empty space after the parent comment's user mention
                          initialSelectedSuggestion: {
                            id: parentComment.creator.id,
                            name: parentComment.creator.fullName,
                          },
                        }
                      : {})}
                  />
                </View>
              </HoliContainer>
            </View>
          </ScrollView>

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            {/* Suggestions*/}
            <PortalGate gateName="suggestions" style={styles.suggestionsScrollView} />

            <HoliContainer>
              <View style={styles.buttonContainer}>
                <HoliButtonLoading
                  disabled={!text.trim().length || createCommentLoading || detectLanguageLoading}
                  loading={createCommentLoading || detectLanguageLoading}
                  label={t('comments.button')}
                  variant="small"
                  inline
                  onPress={handleCommentSubmit}
                  testID="btn-submit-comment"
                >
                  {t('comments.button')}
                </HoliButtonLoading>
              </View>
            </HoliContainer>
          </View>
        </KeyboardAvoidingView>
        <NotificationOptInModal
          type="default"
          isVisible={modalVisible}
          onConfirm={handleOptIn}
          onDismiss={handleModalDismiss}
          description={t('notifications.permission.description.default')}
        />
      </HoliContainer>
    </View>
  )
}

const SUBMIT_BUTTON_CONTAINER_HEIGHT = 64
const SUGGESTIONS_DROPDOWN_HEIGHT = 150
const SMALL_DEVICE_HEIGHT = 600

const getStyles = (screenHeight: number, theme: HoliTheme) =>
  StyleSheet.create({
    pageView: {
      backgroundColor: theme.colors.background10,
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      ...Platform.select({
        web: {
          paddingBottom: dimensions.bottomBarHeight + Spacing.lg,
        },
      }),
    },
    safeArea: {
      flex: 1,
      overflow: 'hidden',
    },
    scrollView: {
      flex: 1,
    },
    verticalLine: {
      marginTop: Spacing['3xs'],
      marginBottom: Spacing['3xs'],
      marginHorizontal: 20,
      minHeight: Spacing.xl,
    },
    inputContainer: {
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
      flexShrink: 1,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
      backgroundColor: theme.colors.background10,
      ...Platform.select({
        web: {
          marginHorizontal: 'auto',
          width: '100%',
          alignSelf: 'center',
          position: 'fixed',
          bottom: 0,
        },
      }),
    },
    suggestionsScrollView: {
      zIndex: screenHeight < SMALL_DEVICE_HEIGHT ? 3 : undefined,
      height: SUGGESTIONS_DROPDOWN_HEIGHT,
      maxHeight: SUGGESTIONS_DROPDOWN_HEIGHT,
      paddingTop: 10,
      marginBottom: screenHeight < SMALL_DEVICE_HEIGHT ? -75 : -10,
      paddingBottom: 10,
      backgroundColor: theme.colors.background10,
      borderRadius: 12,
      elevation: 4,
      borderTopColor: theme.dark ? theme.colors.brandColorB30 : theme.colors.background30,
      borderRightColor: theme.dark ? theme.colors.brandColorB30 : theme.colors.background30,
      borderLeftColor: theme.dark ? theme.colors.brandColorB30 : theme.colors.background30,
      borderWidth: 1,
      borderBottomWidth: 0,
      width: '100%',
      ...Platform.select({
        web: {
          maxWidth: dimensions.maxScreenWidth,
          marginHorizontal: 'auto',
          width: '98%',
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
    },
  })

export default CommentForm
