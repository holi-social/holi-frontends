import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { ArrowLeft } from '@holi/icons/src/generated'
import { Button, ButtonIcon } from 'holi-bricks/components/button'

export interface NavigationButtonsProps {
  onNextPress?: () => void
  onBackPress?: () => void
  isBackButtonAvailable?: boolean
  isNextButtonEnabled?: boolean
  nextButtonLabel?: string
  isLoading?: boolean
  testID?: string
}

export const BUTTON_RECT = {
  width: 56,
  height: 56,
}

const NavigationButtons = ({
  onNextPress,
  onBackPress,
  isBackButtonAvailable = true,
  isNextButtonEnabled = true,
  nextButtonLabel,
  isLoading = false,
  testID = 'nav-buttons',
}: React.PropsWithChildren<NavigationButtonsProps>) => {
  const { t } = useTranslation()
  const styles = getStyles()

  return (
    <View style={styles.buttonContainer} testID={testID}>
      {isBackButtonAvailable && (
        <View style={styles.backButton}>
          <ButtonIcon
            label={t('global.back')}
            disabled={false}
            variant="secondary"
            onPress={onBackPress}
            testID={`${testID}-back-btn`}
            icon={ArrowLeft}
          />
        </View>
      )}

      <View style={styles.nextButton}>
        <Button
          loading={isLoading}
          disabled={!isNextButtonEnabled}
          label={nextButtonLabel ?? t('global.next')}
          loadingLabel={t('global.loading')}
          onPress={onNextPress}
          testID={`${testID}-next-btn`}
        />
      </View>
    </View>
  )
}

export default NavigationButtons

const getStyles = () =>
  StyleSheet.create({
    backButton: {
      marginRight: 10,
    },
    nextButton: {
      flex: 1,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  })
