import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export type SpaceContactDescriptionInputProps = {
  onChange: (description: string) => void
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
      placeholder={'Let people know about your preferred way of contact …'}
      inputLabel={'Contact description'}
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
