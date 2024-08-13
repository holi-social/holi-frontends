import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, TextInputKeyPressEventData, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { sendMessage } from '@holi/chat/src/store'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SendPlane } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const isAndroid = Platform.OS === 'android'
const SEND_BUTTON_SIZE = 40

interface TextInputKeyPressEventDataWeb extends TextInputKeyPressEventData {
  shiftKey: boolean
}

const isTextInputKeyPressEventDataWeb = (
  event: TextInputKeyPressEventData | TextInputKeyPressEventDataWeb
): event is TextInputKeyPressEventDataWeb => {
  return Platform.OS === 'web'
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
  const { colors } = theme

  const visibilityProgress = useSharedValue(0)
  const inputAnimatedStyle = useAnimatedStyle(
    () => ({ transform: [{ translateY: interpolate(visibilityProgress.value, [0, 1], [300, 0]) }] }),
    [visibilityProgress]
  )
  useEffect(() => {
    visibilityProgress.value = withTiming(isVisible ? 1 : 0)
  }, [isVisible, visibilityProgress])

  const handleSendMessage = async () => {
    const text = inputValue.trim()

    if (text.length === 0) {
      return
    }

    try {
      setInputValue('')
      await sendMessage({ roomId, text })
    } catch (err) {
      setInputValue(text)
      displayError(err, 'Could not send chat message', {
        location: 'ChatTextInput.handleSendMessage',
      })
    }
  }

  return isVisible ? (
    <Animated.View style={[styles.container, inputAnimatedStyle]}>
      <HoliTextInput
        aria-label={t('chat.room.input.placeholder', { fullName: userName })}
        placeholder={t('chat.room.input.placeholder', { fullName: userName })}
        value={inputValue}
        onChange={setInputValue}
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

      <View style={{ width: SEND_BUTTON_SIZE, height: SEND_BUTTON_SIZE }}>
        {inputValue.trim().length > 0 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <HoliButton
              label={t('chat.room.sendButton.label')}
              disabled={inputValue.trim().length === 0}
              onPress={handleSendMessage}
              inline
              style={styles.button}
            >
              <HoliIcon icon={SendPlane} size={SEND_BUTTON_SIZE / 2} color={colors.foreground30} />
            </HoliButton>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  ) : null
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
    buttonWrapper: {
      width: SEND_BUTTON_SIZE,
      height: SEND_BUTTON_SIZE,
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
