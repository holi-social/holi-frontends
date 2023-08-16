import React, { type Dispatch, type SetStateAction, useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SendPlane } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

const generateContainerStyles = (value: Animated.Value) => {
  const positionStyles = { transform: [{ translateY: value }] }
  return StyleSheet.flatten([styles.container, positionStyles])
}

interface Props {
  text: string
  setText: Dispatch<SetStateAction<string>>
  isVisible: boolean
  onPress: () => Promise<void>
}

export const ChatTextInput = ({ isVisible, onPress, text, setText }: Props) => {
  const positionRef = useRef(new Animated.Value(100))

  useEffect(() => {
    if (!isVisible) return
    Animated.timing(positionRef.current, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [isVisible])

  return (
    <Animated.View style={generateContainerStyles(positionRef.current)}>
      <HoliTextInput
        // TODO: provide correct accessibilityLabel prop
        accessibilityLabel="Message"
        value={text}
        onChange={setText}
        style={styles.textInputContainer}
        inputStyle={styles.textInput}
        maxNoOfVisibleLines={5}
        testID={'chat-message-input'}
      />
      <HoliButton label="" disabled={!text.trim()} onPress={onPress} inline style={styles.button}>
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
