import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export type SpaceContactMailInputProps = {
  onChange: (description: string) => void
  value: string
  errorMessage?: string
}

const SpaceContactMailInput: React.VFC<SpaceContactMailInputProps> = ({
  onChange,
  value,
  errorMessage,
}: SpaceContactMailInputProps) => {
  const { t } = useTranslation()

  return (
    <HoliTextInput
      placeholder={'Email …'}
      inputLabel={'Email adress'}
      type={'number'}
      validationErrorText={errorMessage}
      value={value}
      onChange={onChange}
      accessibilityLabel={t('spaces.input.contact.description.label')}
      testID="space-contact-description"
    />
  )
}

export default SpaceContactMailInput
