import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export type SpaceContactDescriptionInputProps = {
  onChange: (contactDescription: string) => void
  value: string
  errorMessage?: string
}

const SpaceContactDescriptionInput: React.VFC<SpaceContactDescriptionInputProps> = ({
  onChange,
  value,
  errorMessage,
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
      accessibilityLabel={t('spaces.input.contact.description.label')}
      testID="space-contact-description"
    />
  )
}

export default SpaceContactDescriptionInput
