import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput, { HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'
import { SPACE_DESCRIPTION_LEN } from '@holi/core/screens/spaces/create/mutations'

export interface SpaceGoalInputProps extends Partial<HoliTextInputProps> {
  errorMessages?: string[]
}

const SpaceGoalInput: React.FC<SpaceGoalInputProps> = ({
  onChange,
  value,
  errorMessages,
  ...props
}: SpaceGoalInputProps) => {
  const { t } = useTranslation()

  return (
    <HoliTextInput
      placeholder={t('spaces.input.goal.placeholder')}
      inputLabel={t('spaces.input.goal.label')}
      maxNoOfCharacters={SPACE_DESCRIPTION_LEN}
      showCharacterCount={true}
      noOfVisibleLines={5}
      maxNoOfVisibleLines={10}
      validationErrorText={errorMessages?.length ? errorMessages[0] : undefined}
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
