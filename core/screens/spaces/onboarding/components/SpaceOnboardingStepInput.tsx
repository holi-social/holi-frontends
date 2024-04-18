import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type SpaceOnboardingStepInputProps = {
  step: { text: string }
  index: number
  totalSteps: number
  handleChange: (stepNumber: number, value: string) => void
  removeStep: (stepNumber: number) => void
  isNewStep: boolean
}

const SpaceOnboardingStepInput: React.FC<SpaceOnboardingStepInputProps> = ({
  step,
  index,
  totalSteps,
  handleChange,
  removeStep,
  isNewStep,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.input}>
      <HoliTextInput
        maxNoOfCharacters={240}
        aria-label={t('wizard.stepsCount', { current: index, total: totalSteps })}
        showCharacterCount
        inputLabel={t('wizard.stepsCount', { current: index, total: totalSteps })}
        noOfVisibleLines={3}
        maxNoOfVisibleLines={3}
        value={step.text}
        onChange={(value) => handleChange(index, value)}
        placeholder={t('spaces.onboarding.steps.describe')}
        style={styles.inputField}
        isRequired
        validationErrorText={isNewStep || step.text.length ? undefined : t('spaces.onboarding.steps.add.empty')}
      />

      <HoliButton
        label={t('spaces.onboarding.steps.remove')}
        onPress={() => removeStep(index)}
        transparent
        style={styles.removeStepBtn}
      >
        <HoliIcon icon={Delete} size={22} />
      </HoliButton>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    input: {
      ...Platform.select({
        native: {
          maxWidth: '100%',
        },
      }),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    inputField: {
      width: 'auto',
      flexGrow: 1,
      ...Platform.select({
        native: {
          maxWidth: '80%',
        },
      }),
    },
    removeStepBtn: {
      borderWidth: 1,
      backgroundColor: theme.colors.white100,
      borderRadius: 50,
      padding: 12,
      width: 'auto',
    },
  })

export default SpaceOnboardingStepInput
