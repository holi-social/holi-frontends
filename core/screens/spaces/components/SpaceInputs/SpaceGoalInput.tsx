import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput, { HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'

export interface SpaceGoalInputProps extends Partial<HoliTextInputProps> {
  errorMessage?: string
}

const SpaceGoalInput: React.FC<SpaceGoalInputProps> = ({
  onChange,
  value,
  errorMessage,
  ...props
}: SpaceGoalInputProps) => {
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
      {...props}
      aria-label={t('spaces.input.goal.label')}
      testID="space-goal"
      inputProps={{ textAlignVertical: 'top' }}
    />
  )
}

export default SpaceGoalInput
