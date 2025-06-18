import type React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput, { type HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'
import { SPACE_TITLE_LEN } from '@holi/core/screens/spaces/create/validattionSchemas'

export interface SpaceNameInputProps extends Partial<HoliTextInputProps> {
  errorMessages?: string[]
}

const SpaceNameInput: React.FC<SpaceNameInputProps> = ({
  onChange,
  value,
  errorMessages,
  ...props
}: SpaceNameInputProps) => {
  const { t } = useTranslation()

  return (
    <HoliTextInput
      placeholder={t('spaces.input.name.placeholder')}
      inputLabel={t('spaces.input.name.label')}
      maxNoOfCharacters={SPACE_TITLE_LEN}
      showCharacterCount={true}
      validationErrorText={errorMessages?.length ? errorMessages[0] : undefined}
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
