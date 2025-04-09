import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface HoliWizardNavigationButtonsProps {
  onNextPress?: () => void
  onBackPress?: () => void
  isBackButtonAvailable?: boolean
  isNextButtonEnabled?: boolean
  submitButtonLabel?: string
  nextButtonLabel?: string
  isLastStep?: boolean
  isLoading?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}

export const BUTTON_RECTS = {
  width: 56,
  height: 56,
  paddingBottom: 28,
}

const HoliWizardNavigationButtons = ({
  onNextPress,
  onBackPress,
  submitButtonLabel = '',
  isBackButtonAvailable = true,
  isNextButtonEnabled = true,
  isLastStep = false,
  nextButtonLabel,
  style,
  testID,
}: React.PropsWithChildren<HoliWizardNavigationButtonsProps>) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={[mixins.container, styles.buttonContainer, style]} testID={testID}>
      {isBackButtonAvailable && (
        <HoliButton
          label={t('global.back')}
          disabled={false}
          onPress={onBackPress}
          testID={testID ? `${testID}-back-btn` : 'holi-wizard-back-btn'}
          style={styles.backButton}
        >
          <HoliIcon icon={ArrowLeft} colorOverride={colors.foreground30} />
        </HoliButton>
      )}

      <View style={{ flex: 1 }}>
        <HoliButtonLoading
          disabled={!isNextButtonEnabled}
          label={isLastStep ? submitButtonLabel : (nextButtonLabel ?? t('global.next'))}
          loadingLabel={t('global.loading')}
          onPress={onNextPress}
          testID={testID ? `${testID}-next-btn` : 'holi-wizard-save-btn'}
          style={styles.nextButton}
        />
      </View>
    </View>
  )
}

export default HoliWizardNavigationButtons

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    backButton: {
      width: BUTTON_RECTS.width,
      height: BUTTON_RECTS.height,
      borderRadius: BUTTON_RECTS.height / 2,
      marginRight: 10,
      paddingHorizontal: 0,
      paddingVertical: 0,
      backgroundColor: theme.colors.background10,
    },
    nextButton: {
      height: BUTTON_RECTS.height,
      width: '100%',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  })
