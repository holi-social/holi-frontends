import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export type SpaceGoalInputProps = {
  onChange: (name: string) => void
  value: string
  errorMessage?: string
}

const SpaceGoalInput: React.VFC<SpaceGoalInputProps> = ({ onChange, value, errorMessage }: SpaceGoalInputProps) => {
  const { t } = useTranslation()

  return (
    <HoliTextInput
      placeholder={t('spaces.input.goal.placeholder')}
      inputLabel={t('spaces.input.goal.label')}
      maxNoOfCharacters={600}
      showCharacterCount={true}
      noOfVisibleLines={5}
      maxNoOfVisibleLines={10}
      validationErrorText={errorMessage}
      value={value}
      onChange={onChange}
      accessibilityLabel={t('spaces.input.goal.label')}
      testID="space-goal"
    />
  )
}

export default SpaceGoalInput
