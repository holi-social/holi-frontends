import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Platform, StyleSheet, TextInputKeyPressEventData } from 'react-native'

import { sendMessage } from '@holi/chat/src/store'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SendPlane } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

interface TextInputKeyPressEventDataWeb extends TextInputKeyPressEventData {
  shiftKey: boolean
}

const isTextInputKeyPressEventDataWeb = (
  event: TextInputKeyPressEventData | TextInputKeyPressEventDataWeb
): event is TextInputKeyPressEventDataWeb => {
  return Platform.OS === 'web'
}

const generateContainerStyles = (value: Animated.Value) => {
  const positionStyles = { transform: [{ translateY: value }] }
  return StyleSheet.flatten([styles.container, positionStyles])
}

interface Props {
  roomId: string
  isVisible: boolean
  userName?: string
}

export const ChatTextInput = ({ roomId, isVisible, userName = '' }: Props) => {
  const { t } = useTranslation()
  const positionRef = useRef(new Animated.Value(100))

  const [messageText, setMessageText] = useState('')

  useEffect(() => {
    if (!isVisible) return
    Animated.timing(positionRef.current, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [isVisible])

  const handleSendMessage = async () => {
    const text = messageText.trim()
    if (!text) return

    await sendMessage({ roomId, text })
    setMessageText('')
  }

  return (
    <Animated.View style={generateContainerStyles(positionRef.current)}>
      <HoliTextInput
        accessibilityLabel={t('chat.room.input.placeholder', { fullName: userName })}
        placeholder={t('chat.room.input.placeholder', { fullName: userName })}
        value={messageText}
        onChange={setMessageText}
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
      <HoliButton label="" disabled={!messageText.trim()} onPress={handleSendMessage} inline style={styles.button}>
        <HoliIcon icon={SendPlane} size={20} color={colors.foreground30} />
      </HoliButton>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomColor: colors.white100,
    borderWidth: 2,
    borderColor: colors.background30,
    backgroundColor: colors.white100,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignSelf: 'flex-end',
  },
  textInputContainer: {
    backgroundColor: colors.white100,
    flexShrink: 1,
  },
  textInput: {
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
})
