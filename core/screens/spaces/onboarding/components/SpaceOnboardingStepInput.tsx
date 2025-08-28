import type React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Delete } from '@holi/icons/src/generated'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { ButtonIcon } from 'holi-bricks/components/button'
import type { OnboardingStep } from '@holi/api/graphql/graphql-codegen'

export type SpaceOnboardingStepInputProps = {
  step: OnboardingStep
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
  const styles = getStyles()

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
        validationErrorText={isNewStep || step.text?.length ? undefined : t('spaces.onboarding.steps.add.empty')}
      />

      <ButtonIcon
        label={t('spaces.onboarding.steps.remove')}
        onPress={() => removeStep(index)}
        variant="secondary"
        icon={Delete}
        size="lg"
      />
    </View>
  )
}

const getStyles = () =>
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
  })

export default SpaceOnboardingStepInput
