import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { getOrdinal } from '@holi/core/helpers/getOrdinal'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceOnboardingStepsInputProps = {
  step: { text: string }
  index: number
  handleChange: (stepNumber: number, value: string) => void
  removeStep: (stepNumber: number) => void
}

const SpaceOnboardingStepsInput: React.VFC<SpaceOnboardingStepsInputProps> = ({
  step,
  index,
  handleChange,
  removeStep,
}) => {
  const { t } = useTranslation()
  const label = getOrdinal(index) + ' step'
  return (
    <View style={styles.input}>
      <HoliTextInput
        maxNoOfCharacters={240}
        accessibilityLabel={label}
        showCharacterCount
        inputLabel={label}
        noOfVisibleLines={3}
        maxNoOfVisibleLines={3}
        value={step.text}
        onChange={(value) => handleChange(index, value)}
        placeholder={t('spaces.onboarding.steps.describe')}
        style={[styles.inputField, index === 1 && styles.inputFieldWithoutDelete]}
      />

      {index !== 1 && (
        <HoliButton
          label={t('spaces.onboarding.steps.remove')}
          onPress={() => removeStep(index)}
          transparent
          style={styles.removeStepBtn}
        >
          <HoliIcon icon="delete" size={22} />
        </HoliButton>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
        width: '200%',
      },
    }),
  },
  inputFieldWithoutDelete: {
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  removeStepBtn: {
    borderWidth: 1,
    backgroundColor: colors.white100,
    borderRadius: 50,
    padding: 12,
    width: 'auto',
  },
})

export default SpaceOnboardingStepsInput
