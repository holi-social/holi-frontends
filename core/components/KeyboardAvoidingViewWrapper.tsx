import React, { useRef } from 'react'
import { KeyboardAvoidingView, Platform, type ScrollView, type ViewProps } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'

export interface KeyboardAvoidingViewWrapperProps extends ViewProps {
  renderProp: (scrollToPropsFor: ReturnType<typeof useScrollToInputOnFocus>) => React.ReactNode
}

const KeyboardAvoidingViewWrapper = React.forwardRef<KeyboardAvoidingView, KeyboardAvoidingViewWrapperProps>(
  ({ renderProp }: KeyboardAvoidingViewWrapperProps, ref) => {
    const scrollViewRef = useRef<ScrollView>(null)
    const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.wrapper} ref={ref}>
        <HoliKeyboardSaveView style={{ position: 'relative' }}>{renderProp(scrollToInputWithId)}</HoliKeyboardSaveView>
      </KeyboardAvoidingView>
    )
  }
)

KeyboardAvoidingViewWrapper.displayName = 'KeyboardAvoidingViewWrapper'

export default KeyboardAvoidingViewWrapper

const styles = StyleSheet.create({
  wrapper: {
    height: '100%', // prevents double scrollbars
    overflow: 'hidden',
    ...Platform.select({
      android: {
        paddingBottom: 0,
      },
    }),
  },
})
