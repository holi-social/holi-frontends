import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.buttonContainer} testID={testID}>
      {isBackButtonAvailable && (
        <HoliButton
          label={t('global.back')}
          disabled={false}
          onPress={onBackPress}
          testID={`${testID}-back-btn`}
          style={styles.backButton}
        >
          <HoliIcon icon={ArrowLeft} color={colors.foreground30} />
        </HoliButton>
      )}

      <View style={{ flex: 1 }}>
        <HoliButtonLoading
          loading={isLoading}
          disabled={!isNextButtonEnabled}
          label={nextButtonLabel ?? t('global.next')}
          loadingLabel={t('global.loading')}
          onPress={onNextPress}
          testID={`${testID}-next-btn`}
          style={styles.nextButton}
        />
      </View>
    </View>
  )
}

export default NavigationButtons

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    backButton: {
      width: BUTTON_RECT.width,
      height: BUTTON_RECT.height,
      borderRadius: BUTTON_RECT.height / 2,
      marginRight: 10,
      paddingHorizontal: 0,
      paddingVertical: 0,
      backgroundColor: theme.colors.background10,
    },
    nextButton: {
      height: BUTTON_RECT.height,
      width: '100%',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  })
