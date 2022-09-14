import React from 'react'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { useKeyboard } from '@holi/core/helpers'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliModalContentWrapper {
  actionButtonText: string
  headlineText?: string
  prependChildren?: React.ReactNode
  onActionButtonPress: () => void
  style?: StyleProp<ViewStyle>
  loading?: boolean
  testID?: string
}

const HoliModalContentWrapper: React.FC<HoliModalContentWrapper> = ({
  actionButtonText,
  onActionButtonPress,
  headlineText,
  prependChildren,
  children,
  style,
  loading = false,
  testID = 'holi-modal-content',
}) => {
  const { keyboardHeight } = useKeyboard()

  return (
    <View style={[styles.container, style]} testID={testID}>
      {prependChildren}

      {loading && (
        <Animated.View style={styles.loaderContainer} entering={FadeIn} exiting={FadeOut.delay(300)}>
          <View style={styles.loader}>
            <HoliLottie animType="loader" />
          </View>
        </Animated.View>
      )}

      <ScrollView>
        {headlineText && (
          <HoliHeading level="1" style={styles.headline} size="large" testID={`${testID}-heading`}>
            {headlineText}
          </HoliHeading>
        )}

        {children}

        <View style={styles.placeHolder} />
      </ScrollView>

      <View style={[styles.actionButtonContainer, keyboardHeight > 0 && styles.hiddenButton]}>
        <HoliButton label={actionButtonText} onPress={onActionButtonPress} testID={`${testID}-close-btn`}>
          {actionButtonText}
        </HoliButton>
      </View>
    </View>
  )
}

export default HoliModalContentWrapper

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    maxHeight: '100%',
    width: '100%',
    maxWidth: 800,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    zIndex: 2,
    backgroundColor: colors.backgroundColorWhite,
  },
  loader: {
    height: 64,
    width: 64,
  },
  headline: {
    marginBottom: 16,
    textAlign: 'center',
    marginHorizontal: 24,
  },
  placeHolder: {
    // space behind the action button
    // and room when the keyboard is open
    height: 120,
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 32,
    right: 0,
    left: 0,
    marginHorizontal: 24,
    opacity: 1,
    visibility: 'visible',
    transition: 'all 2s',
  },
  hiddenButton: {
    opacity: 0,
    visibility: 'none',
  },
})
