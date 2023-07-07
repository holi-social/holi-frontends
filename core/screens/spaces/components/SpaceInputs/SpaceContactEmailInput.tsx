import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput, { HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'

export interface SpaceContactEmailInputProps extends Partial<HoliTextInputProps> {
  onChange: (mail: string) => void
  value: string
  errorMessage?: string
}

const SpaceContactEmailInput: React.VFC<SpaceContactEmailInputProps> = ({
  onChange,
  value,
  errorMessage,
  ...props
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
      {...props}
    />
  )
}

export default SpaceContactEmailInput
