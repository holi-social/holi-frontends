import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput, { HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'

export interface SpaceContactPhoneInputWebProps extends Partial<HoliTextInputProps> {
  onChange: (contactPhone: string) => void
  value: string
  errorMessage?: string
}

// currently used for web & mobile until the phone input (HOLI-3549) is implemented
const SpaceContactPhoneInputWeb: React.VFC<SpaceContactPhoneInputWebProps> = ({
  onChange,
  value,
  errorMessage,
  ...props
}: SpaceContactPhoneInputWebProps) => {
  const { t } = useTranslation()

  return (
    <>
      <HoliTextInput
        placeholder={'+49'}
        inputLabel={t('spaces.input.contact.phone.label')}
        validationErrorText={errorMessage}
        value={value}
        type="number"
        onChange={(text: string) => onChange(text.replace(/[^0-9+ .]/g, ''))} // allow only numbers, + and space characters
        aria-label={t('spaces.input.contact.phone.label')}
        testID="space-contact-phone"
        {...props}
      />
    </>
  )
}

export default SpaceContactPhoneInputWeb
