import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput, { HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'

export interface SpaceNameInputProps extends Partial<HoliTextInputProps> {
  errorMessage?: string
}

const SpaceNameInput: React.FC<SpaceNameInputProps> = ({
  onChange,
  value,
  errorMessage,
  ...props
}: SpaceNameInputProps) => {
  const { t } = useTranslation()

  return (
    <HoliTextInput
      placeholder={t('spaces.input.name.placeholder')}
      inputLabel={t('spaces.input.name.label')}
      maxNoOfCharacters={60}
      showCharacterCount={true}
      validationErrorText={errorMessage}
      value={value}
      onChange={onChange}
      {...props}
      helperText={t('spaces.input.name.description')}
      aria-label={t('spaces.input.name.label')}
      testID="space-name"
    />
  )
}

export default SpaceNameInput
