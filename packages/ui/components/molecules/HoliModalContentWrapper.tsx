import React, { useMemo } from 'react'
import {
  Keyboard,
  Platform,
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from 'react-native'
import { type EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { Text } from 'holi-bricks/components/text'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useKeyboard, useSoftKeyboard } from '@holi/ui/helper'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'

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
  buttonStyle?: StyleProp<ViewStyle>
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
    buttonStyle,
  }: React.PropsWithChildren<HoliModalContentWrapperProps>,
  ref: React.ForwardedRef<ScrollView>
) => {
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
          <Text headingLevel="2" size="3xl" textAlign={headlineAlign} testID={`${testID}-heading`}>
            {headlineText}
          </Text>
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
        <View style={[styles.button, buttonStyle]}>
          <Button
            label={actionButtonText}
            onPress={onActionButtonPress}
            disabled={actionButtonDisabled}
            testID={`${testID}-close-btn`}
          />
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
      paddingBottom: insets.bottom,
    },
    button: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      maxWidth: dimensions.maxButtonWidth,
      alignSelf: 'center',
      width: '100%',
    },
    saveLoaderContainer: {
      backgroundColor: theme.colors.background10,
    },
  })
