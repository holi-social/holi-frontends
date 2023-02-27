import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface HoliWizardNaviagtionButtonsProps {
  onNextPress?: () => void
  onBackPress?: () => void
  isBackButtonAvailable?: boolean
  isNextButtonEnabled?: boolean
  submitButtonLabel?: string
  isLastStep?: boolean
  isLoading?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliWizardNaviagtionButtons = ({
  onNextPress,
  onBackPress,
  submitButtonLabel = '',
  isBackButtonAvailable = true,
  isNextButtonEnabled = true,
  isLastStep = false,
  isLoading = false,
  style,
  testID,
}: React.PropsWithChildren<HoliWizardNaviagtionButtonsProps>) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  return (
    <View style={[mixins.container, styles.buttonContainer, style]} testID={testID}>
      {isBackButtonAvailable && (
        <HoliButton
          label={t('global.back')}
          disabled={false}
          onPress={onBackPress}
          testID="holi-wizard-back-btn"
          style={styles.backButton}
        >
          <HoliIcon icon={'arrow-left'} size={24} color={colors.foreground30} />
        </HoliButton>
      )}

      <View style={{ flex: 1 }}>
        <HoliButtonLoading
          disabled={!isNextButtonEnabled || isLoading}
          label={isLoading ? t('global.loading') : isLastStep ? submitButtonLabel : t('global.next')}
          onPress={onNextPress}
          testID="holi-wizard-next-btn"
          style={styles.nextButton}
          icon={isLoading ? 'loader-4' : undefined}
          iconSpinning={isLoading}
        />
      </View>
    </View>
  )
}

export default HoliWizardNaviagtionButtons

const styles = StyleSheet.create({
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: colors.background10,
  },
  nextButton: { height: 56, width: '100%' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
