import React from 'react'
import { useTranslation } from 'react-i18next'

import AcceptDocumentLayout from '@holi/core/auth/components/AcceptDocumentLayout'
import DataConsentDocument from '@holi/core/screens/dataConsent/DataConsentDocument'

interface DataConsentProps {
  onNextPress?: () => void
  onBackPress?: () => void
}

const DataConsent = ({ onNextPress, onBackPress }: DataConsentProps) => {
  const { t } = useTranslation()

  return (
    <AcceptDocumentLayout
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      imageSource={require('@holi/ui/assets/img/illustrations/registration_consent_data.svg')}
      imageLabelText={t('registration.dataconsent.imageLabel')}
      headlineText={t('registration.dataconsent.heading')}
      descriptionText={t('registration.dataconsent.describtion')}
      checkboxLabelTranslation="registration.dataconsent.checkboxLabel"
      documentNavPath="/communityGuidelines"
      modalLabelText={t('registration.dataconsent')}
      testID="data-consent"
    >
      <DataConsentDocument />
    </AcceptDocumentLayout>
  )
}

export default DataConsent
