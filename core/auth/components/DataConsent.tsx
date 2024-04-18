import React from 'react'
import { useTranslation } from 'react-i18next'

import AcceptDocumentLayout, { AgreementProps } from '@holi/core/auth/components/AcceptDocumentLayout'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'

interface DataConsentProps extends AgreementProps {
  onNextPress?: () => void
  onBackPress?: () => void
}

const DataConsent = ({ onNextPress, onBackPress, ...agreementProps }: DataConsentProps) => {
  const { t } = useTranslation()
  const documentUrl = useDocumentURL('privacyPolicy')

  return (
    <AcceptDocumentLayout
      docUrl={documentUrl}
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      {...agreementProps}
      imageSource={require('@holi/ui/assets/img/illustrations/registration_consent_data.svg')}
      imageLabelText={t('registration.dataconsent.imageLabel')}
      headlineText={t('registration.dataconsent.heading')}
      descriptionText={t('registration.dataconsent.description')}
      checkboxLabelTranslation="registration.dataconsent.checkboxLabel"
      documentNavPath="/profile/settings/legalDocuments/document?type=privacyPolicy"
      modalLabelText={t('registration.dataconsent')}
      testID="privacy-policy"
    />
  )
}

export default DataConsent
