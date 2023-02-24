import React from 'react'
import {
  Keyboard,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useKeyboard, useSoftKeyboard } from '@holi/ui/helper'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface HoliModalContentWrapperProps {
  actionButtonText: string
  headlineText?: string
  prependChildren?: React.ReactNode
  onActionButtonPress: () => void
  style?: StyleProp<ViewStyle>
  loading?: boolean
  testID?: string
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps']
  scrollable?: boolean
  hideFooterWhenKeyboardIsOpen?: boolean
}

const HoliModalContentWrapper = (
  {
    actionButtonText,
    onActionButtonPress,
    headlineText,
    prependChildren,
    children,
    style,
    keyboardShouldPersistTaps,
    loading = false,
    testID = 'holi-modal-content',
    scrollable = true,
    hideFooterWhenKeyboardIsOpen = false,
  }: React.PropsWithChildren<HoliModalContentWrapperProps>,
  ref: React.ForwardedRef<ScrollView>
) => {
  const { keyboardIsOpen } = useKeyboard()
  const { softkeyboardIsOpen } = useSoftKeyboard()
  const showFooter = !hideFooterWhenKeyboardIsOpen || !(keyboardIsOpen || softkeyboardIsOpen)
  const mixins = useStyleMixins()
  const content = (
    <>
      {!!headlineText?.length && (
        <HoliHeading level="1" style={styles.headline} size="large" testID={`${testID}-heading`}>
          {headlineText}
        </HoliHeading>
      )}

      {Platform.OS === 'web' ? (
        children
      ) : (
        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
          {children}
        </TouchableWithoutFeedback>
      )}

      <View style={styles.placeHolder} />
    </>
  )

  return (
    <View style={[styles.container, style]} testID={testID}>
      {prependChildren}

      {loading && <HoliLoader style={styles.saveLoaderContainer} />}

      {scrollable ? (
        <ScrollView ref={ref} keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
          {content}
        </ScrollView>
      ) : (
        content
      )}

      {showFooter && (
        <View style={styles.actionButtonContainer}>
          <HoliButton
            label={actionButtonText}
            onPress={onActionButtonPress}
            style={[mixins.moreButton, styles.button]}
            testID={`${testID}-close-btn`}
          >
            {actionButtonText}
          </HoliButton>
        </View>
      )}
    </View>
  )
}

export default React.forwardRef(HoliModalContentWrapper)

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: 'auto',
    maxHeight: '100%',
    width: '100%',
    maxWidth: 800,
    ...(Platform.OS === 'web' ? { flex: 1 } : {}),
  },
  headline: {
    marginBottom: 16,
    textAlign: 'center',
    marginHorizontal: 24,
  },
  placeHolder: {
    // space behind the action button
    // and room when the keyboard is open
    zIndex: -1, // necessary to avoid it being on top of absolute positioned elements
    height: 120,
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 32,
    right: 0,
    left: 0,
    marginHorizontal: 24,
    opacity: 1,
  },
  button: {
    marginTop: 0,
    maxWidth: vars.maxButtonWidth,
  },
  saveLoaderContainer: {
    backgroundColor: colors.background10,
  },
})
