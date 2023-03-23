import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export type SpaceContactPhoneInputWebProps = {
  onChange: (phone: number) => void
  value: number
  errorMessage?: string
}

const SpaceContactPhoneInputWeb: React.VFC<SpaceContactPhoneInputWebProps> = ({
  onChange,
  value,
  errorMessage,
}: SpaceContactPhoneInputWebProps) => {
  const { t } = useTranslation()

  return (
    <>
      <HoliTextInput
        placeholder={'+49'}
        inputLabel={t('spaces.input.contact.phone.label')}
        type={'number'}
        validationErrorText={errorMessage}
        value={value}
        onChange={onChange}
        accessibilityLabel={t('spaces.input.contact.phone.label')}
        testID="space-contact-phone-input"
      />
    </>
  )
}

export default SpaceContactPhoneInputWeb
