import { Spacing } from 'holi-bricks/tokens'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, type TextInputKeyPressEventData, View } from 'react-native'

import { sendMessage } from '@holi/chat/src/store'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { SendPlane } from '@holi/icons/src/generated'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { ButtonIcon } from 'holi-bricks/components/button'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const isAndroid = Platform.OS === 'android'
const SEND_BUTTON_SIZE = 40
const BORDER_WIDTH = 2

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

  const PLACEHOLDER_MIN_HIGHT = SEND_BUTTON_SIZE + Spacing.xxs * 2 + BORDER_WIDTH * 2

  return (
    <View style={{ minHeight: PLACEHOLDER_MIN_HIGHT, width: '100%' }}>
      <HoliTransition.SlideDown visible={isVisible} style={styles.container}>
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

        <View style={styles.buttonWrapper}>
          {inputValue.trim().length > 0 && (
            <HoliTransition.Fade visible>
              <ButtonIcon
                label={t('chat.room.sendButton.label')}
                disabled={inputValue.trim().length === 0}
                onPress={handleSendMessage}
                icon={SendPlane}
              />
            </HoliTransition.Fade>
          )}
        </View>
      </HoliTransition.SlideDown>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['3xs'],
      paddingHorizontal: Spacing.xs,
      paddingVertical: Spacing.xxs,
      borderTopLeftRadius: Spacing.md,
      borderTopRightRadius: Spacing.md,
      borderBottomColor: theme.colors.white100,
      borderWidth: BORDER_WIDTH,
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.white100,
    },
    buttonWrapper: {
      width: SEND_BUTTON_SIZE,
      height: SEND_BUTTON_SIZE,
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
