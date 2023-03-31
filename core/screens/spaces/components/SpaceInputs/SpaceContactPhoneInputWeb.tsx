import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export type SpaceContactPhoneInputWebProps = {
  onChange: (contactPhone: number) => void
  value: number
  errorMessage?: string
}

// currently used for web & mobile until the phone input (HOLI-3549) is implemented
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
        testID="space-contact-phone"
      />
    </>
  )
}

export default SpaceContactPhoneInputWeb
