import React, { useMemo } from 'react'
import {
  Keyboard,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useKeyboard, useSoftKeyboard } from '@holi/ui/helper'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface HoliModalContentWrapperProps {
  actionButtonText: string
  actionButtonDisabled?: boolean
  headlineText?: string
  headlineAlign?: TextStyle['textAlign']
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
    actionButtonDisabled = false,
    onActionButtonPress,
    headlineText,
    headlineAlign = 'left',
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
  const mixins = useStyleMixins()
  const { isKeyboardOpen } = useKeyboard()
  const { isSoftkeyboardOpen } = useSoftKeyboard()
  const showFooter = !hideFooterWhenKeyboardIsOpen || !(isKeyboardOpen || isSoftkeyboardOpen)
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme, insets), [theme, insets])

  const content = (
    <>
      {!!headlineText?.length && (
        <HoliBox padding={[0, 24, 16, 24]}>
          <HoliHeading level="2" size="l" align={headlineAlign} testID={`${testID}-heading`}>
            {headlineText}
          </HoliHeading>
        </HoliBox>
      )}

      {Platform.OS === 'web' ? (
        children
      ) : (
        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
          {children}
        </TouchableWithoutFeedback>
      )}

      {isSoftkeyboardOpen && <View style={styles.keyboardPlaceHolder} />}
    </>
  )

  return (
    <View style={[styles.container, style]} testID={testID}>
      {prependChildren}

      {loading && <HoliLoader style={styles.saveLoaderContainer} testID={`${testID}-loader`} />}

      {scrollable ? (
        <ScrollView
          ref={ref}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          contentContainerStyle={styles.scrollViewContent}
        >
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
            disabled={actionButtonDisabled}
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

const getStyles = (theme: HoliTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      marginHorizontal: 'auto',
      maxHeight: '100%',
      width: '100%',
      flexShrink: 1,
      maxWidth: 800,
      ...(Platform.OS === 'web' ? { flex: 1 } : {}),
    },
    keyboardPlaceHolder: {
      // room when the softkeyboard is open
      zIndex: -1, // necessary to avoid it being on top of absolute positioned elements
      height: 120,
    },
    scrollViewContent: {
      paddingBottom: insets.bottom + 96,
    },
    actionButtonContainer: {
      position: 'absolute',
      zIndex: 1,
      bottom: 32,
      right: 0,
      left: 0,
      marginHorizontal: 24,
      opacity: 1,
    },
    button: {
      marginTop: 0,
      maxWidth: dimensions.maxButtonWidth,
      marginBottom: insets.bottom,
    },
    saveLoaderContainer: {
      backgroundColor: theme.colors.background10,
    },
  })
