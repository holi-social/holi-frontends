import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Platform, StyleSheet, TextInputKeyPressEventData, ViewStyle } from 'react-native'

import { sendMessage } from '@holi/chat/src/store'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SendPlane } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useDebounce } from '@holi/ui/helper'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const isAndroid = Platform.OS === 'android'

interface TextInputKeyPressEventDataWeb extends TextInputKeyPressEventData {
  shiftKey: boolean
}

const isTextInputKeyPressEventDataWeb = (
  event: TextInputKeyPressEventData | TextInputKeyPressEventDataWeb
): event is TextInputKeyPressEventDataWeb => {
  return Platform.OS === 'web'
}

const generateContainerStyles = (value: Animated.Value, styles: ViewStyle) => {
  const positionStyles = { transform: [{ translateY: value }] }
  return StyleSheet.flatten([styles, positionStyles])
}

interface Props {
  roomId: string
  isVisible: boolean
  userName?: string
}

export const ChatTextInput = ({ roomId, isVisible, userName = '' }: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { displayError } = useErrorHandling()

  const [inputValue, setInputValue] = useState('')
  const styles = useMemo(() => getStyles(theme), [theme])
  const positionAnimRef = useRef(new Animated.Value(100))
  const fadeAnimRef = useRef(new Animated.Value(0))

  const { colors } = theme

  const fadeIn = () => {
    Animated.timing(fadeAnimRef.current, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const debouncedFadeIn = useDebounce(fadeIn, 200)

  const fadeOut = () => {
    Animated.timing(fadeAnimRef.current, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const handleChange = (value: string) => {
    if (value.trim().length === 0) {
      fadeOut()
    } else {
      debouncedFadeIn()
    }

    setInputValue(value)
  }

  const handleSendMessage = async () => {
    const text = inputValue.trim()

    if (text.length === 0) {
      fadeOut()
      return
    }

    try {
      setInputValue('')
      await sendMessage({ roomId, text })
      fadeOut()
    } catch (err) {
      setInputValue(text)
      displayError(err, 'Could not send chat message', {
        location: 'ChatTextInput.handleSendMessage',
      })
    }
  }

  useEffect(() => {
    if (!isVisible) return
    Animated.timing(positionAnimRef.current, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [isVisible])

  return (
    <Animated.View style={generateContainerStyles(positionAnimRef.current, styles.container)}>
      <HoliTextInput
        aria-label={t('chat.room.input.placeholder', { fullName: userName })}
        placeholder={t('chat.room.input.placeholder', { fullName: userName })}
        value={inputValue}
        onChange={handleChange}
        style={styles.textInputContainer}
        inputStyle={styles.textInput}
        maxNoOfVisibleLines={5}
        inputProps={{
          onKeyPress: (event) => {
            if (
              isTextInputKeyPressEventDataWeb(event.nativeEvent) &&
              event.nativeEvent.key === 'Enter' &&
              event.nativeEvent.shiftKey
            ) {
              event.preventDefault()
              handleSendMessage()
            }
          },
        }}
        testID={'chat-message-input'}
      />
      <Animated.View style={{ opacity: fadeAnimRef.current }}>
        <HoliButton
          label={t('chat.room.sendButton.label')}
          disabled={inputValue.trim().length === 0}
          onPress={handleSendMessage}
          inline
          style={styles.button}
        >
          <HoliIcon icon={SendPlane} size={20} color={colors.foreground30} />
        </HoliButton>
      </Animated.View>
    </Animated.View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderBottomColor: theme.colors.white100,
      borderWidth: 2,
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.white100,
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 8,
      alignSelf: 'center',
    },
    textInputContainer: {
      maxHeight: isAndroid ? 110 : 132,
      backgroundColor: theme.colors.white100,
      flexShrink: 1,
    },
    textInput: {
      borderWidth: 0,
      paddingVertical: 0,
      paddingHorizontal: 0,
      backgroundColor: theme.colors.white100,
    },
  })
