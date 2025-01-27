import { useLazyQuery, useMutation } from '@apollo/client'
import * as Notifications from 'expo-notifications'
import React, { type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Linking, Platform, type ScrollView, StyleSheet, View } from 'react-native'
import type { LayoutChangeEvent } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { isMaliciousUrlError, isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { type DetectLanguageQueryResponse, detectLanguageQuery } from '@holi/core/queries'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import { AddCommentMutation, type CreateCommentResponse } from '@holi/core/screens/comments/mutations'
import { commentsByCommentable, commentsMetadata } from '@holi/core/screens/comments/queries'
import { type Comment, CommentableType } from '@holi/core/screens/comments/types'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import NotificationOptInModal from '@holi/core/screens/notifications/components/NotificationOptInModal'
import { dismissNotificationModal } from '@holi/core/screens/notifications/helpers/notificationModalHelper/notificationModalHelper'
import {
  incrementModalAttempts,
  useNotificationEligibility,
} from '@holi/core/screens/notifications/helpers/notificationModalHelper/notificationModalHelper'
import { PostById } from '@holi/core/screens/posts/queries'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Button } from 'holi-bricks/components/button'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import FormLayout from '@holi/core/components/FormLayout/FormLayout'
import { Avatar } from 'holi-bricks/components/avatar'

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
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const [scrollContentHeight, setScrollContentHeight] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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
    await incrementModalAttempts()
    setModalVisible(false)
    if (redirectRoute) {
      replaceRoute(redirectRoute)
    } else {
      navigateBack()
    }
  }

  const handleDismissNotification = async () => {
    await dismissNotificationModal()
    setModalVisible(false)
    if (redirectRoute) {
      replaceRoute(redirectRoute)
    } else {
      navigateBack()
    }
  }

  return (
    <>
      <FormLayout
        hasSuggestions
        backgroundColor={theme.colors.background10}
        scrollViewRef={scrollViewRef}
        bottomBar={
          <View style={styles.bottomBar}>
            <HoliContainer>
              <View style={styles.buttonContainer}>
                <Button
                  disabled={!text.trim().length || createCommentLoading || detectLanguageLoading}
                  loading={createCommentLoading || detectLanguageLoading}
                  label={t('comments.button')}
                  size="sm"
                  inline
                  onPress={handleCommentSubmit}
                  testID="btn-submit-comment"
                />
              </View>
            </HoliContainer>
          </View>
        }
      >
        <View>
          {children}
          {/* Comment input block */}

          {!parentComment && <VerticalLine style={styles.verticalLine} />}

          <View style={styles.inputContainer}>
            <View style={styles.avatarContainer}>
              <Avatar
                imgSrc={user.avatar}
                imgPlaceholder={user.avatarBlurhash}
                label={user.fullName || t('user.profileView.anonymous')}
                size={parentComment ? 'xs' : 'sm'}
                initials={user.avatarLabel || ''}
              />
            </View>
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
        </View>
      </FormLayout>

      {Platform.OS !== 'web' && (
        <NotificationOptInModal
          type="default"
          isVisible={modalVisible}
          onConfirm={handleOptIn}
          onDismiss={handleModalDismiss}
          dismissModal={handleDismissNotification}
          description={t('notifications.permission.description.default')}
        />
      )}
    </>
  )
}

const SUBMIT_BUTTON_CONTAINER_HEIGHT = 64

const getStyles = (theme: HoliTheme) =>
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
    avatarContainer: {
      marginTop: Spacing['3xs'],
    },
    textInput: {
      flex: 1,
      marginLeft: 2,
      ...Platform.select({
        web: {
          marginLeft: Spacing['3xs'],
        },
      }),
    },
    bottomBar: {
      flexShrink: 1,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
      backgroundColor: theme.colors.background10,
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
