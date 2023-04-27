import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export type SpaceContactEmailInputProps = {
  onChange: (mail: string) => void
  value: string
  errorMessage?: string
}

const SpaceContactEmailInput: React.VFC<SpaceContactEmailInputProps> = ({
  onChange,
  value,
  errorMessage,
}: SpaceContactEmailInputProps) => {
  const { t } = useTranslation()

  return (
    <HoliTextInput
      placeholder={'Email …'}
      inputLabel={t('spaces.input.contact.email.label')}
      type={'email'}
      validationErrorText={errorMessage}
      value={value}
      onChange={onChange}
      accessibilityLabel={t('spaces.input.contact.description.label')}
      testID="space-contact-mail"
    />
  )
}

export default SpaceContactEmailInput
