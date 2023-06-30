import React from 'react'
import { useTranslation } from 'react-i18next'

import AcceptDocumentLayout, { AgreementProps } from '@holi/core/auth/components/AcceptDocumentLayout'
import { getDocumentURL } from '@holi/core/helpers'

interface DataConsentProps extends AgreementProps {
  onNextPress?: () => void
  onBackPress?: () => void
}

const DataConsent = ({ onNextPress, onBackPress, ...agreementProps }: DataConsentProps) => {
  const { t } = useTranslation()

  return (
    <AcceptDocumentLayout
      docUrl={getDocumentURL('privacyPolicy')}
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      {...agreementProps}
      imageSource={require('@holi/ui/assets/img/illustrations/registration_consent_data.svg')}
      imageLabelText={t('registration.dataconsent.imageLabel')}
      headlineText={t('registration.dataconsent.heading')}
      descriptionText={t('registration.dataconsent.description')}
      checkboxLabelTranslation="registration.dataconsent.checkboxLabel"
      documentNavPath="/communityGuidelines"
      modalLabelText={t('registration.dataconsent')}
      testID="privacy-policy"
    />
  )
}

export default DataConsent
