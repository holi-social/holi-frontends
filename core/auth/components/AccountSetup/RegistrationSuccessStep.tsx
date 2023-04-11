import React from 'react'
import { useTranslation } from 'react-i18next'

import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'

export interface RegistrationSuccessStepProps {
  firstName: string
}

const RegistrationSuccessStep = ({ firstName }: RegistrationSuccessStepProps) => {
  const { t } = useTranslation()

  return (
    <CenteredImageHeadlineDescriptionLayout
      imageSource={require('@holi/ui/assets/img/illustrations/registration_success.svg')}
      imageLabelText={t('registration.accountSetup.firstSuccess.heading', { name: firstName })}
      headlineText={t('registration.accountSetup.firstSuccess.heading', { name: firstName })}
      descriptionText={t('registration.accountSetup.firstSuccess.describtion')}
      testID="registration-success"
    />
  )
}

export default RegistrationSuccessStep
