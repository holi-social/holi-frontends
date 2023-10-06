import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput, { HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'

export interface SpaceContactDescriptionInputProps extends Partial<HoliTextInputProps> {
  onChange: (contactDescription: string) => void
  value: string
  errorMessage?: string
}

const SpaceContactDescriptionInput: React.VFC<SpaceContactDescriptionInputProps> = ({
  onChange,
  value,
  errorMessage,
  ...props
}: SpaceContactDescriptionInputProps) => {
  const { t } = useTranslation()

  return (
    <HoliTextInput
      placeholder={t('spaces.input.contact.description.placeholder')}
      inputLabel={t('spaces.input.contact.description.label')}
      maxNoOfCharacters={100}
      showCharacterCount={true}
      noOfVisibleLines={5}
      maxNoOfVisibleLines={10}
      validationErrorText={errorMessage}
      value={value}
      onChange={onChange}
      aria-label={t('spaces.input.contact.description.label')}
      testID="space-contact-description"
      {...props}
    />
  )
}

export default SpaceContactDescriptionInput
