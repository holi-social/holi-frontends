import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export type SpaceNameInputProps = {
  onChange: (name: string) => void
  value: string
  errorMessage?: string
}

const SpaceNameInput: React.VFC<SpaceNameInputProps> = ({ onChange, value, errorMessage }: SpaceNameInputProps) => {
  const { t } = useTranslation()

  return (
    <HoliTextInput
      placeholder={t('spaces.create.space.name.input.placeholder')}
      inputLabel={t('spaces.create.space.name.label')}
      maxNoOfCharacters={60}
      showCharacterCount={true}
      validationErrorText={errorMessage}
      value={value}
      onChange={onChange}
      helperText={t('spaces.create.space.name.input.description')}
      accessibilityLabel={t('spaces.create.space.name.label')}
    />
  )
}

export default SpaceNameInput
