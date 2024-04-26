import React from 'react'
import { useTranslation } from 'react-i18next'

import AcceptDocumentLayout, { AgreementProps } from '@holi/core/auth/components/AcceptDocumentLayout'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'

interface CommunityGuidelinesProps extends AgreementProps {
  onNextPress?: () => void
  onBackPress?: () => void
}

const CommunityGuidelines = ({ onNextPress, onBackPress, ...agreementProps }: CommunityGuidelinesProps) => {
  const { t } = useTranslation()
  const documentUrl = useDocumentURL('communityGuidelines')

  return (
    <AcceptDocumentLayout
      docUrl={documentUrl}
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      {...agreementProps}
      imageSource={require('@holi/ui/assets/img/illustrations/registration_community_guidelines.svg')}
      imageLabelText={t('registration.communityGuidelines.imageLabel')}
      headlineText={t('registration.communityGuidelines.heading')}
      descriptionText={t('registration.communityGuidelines.description')}
      checkboxLabelTranslation="registration.communityGuidelines.checkboxLabel"
      documentNavPath="/profile/settings/legalDocuments/document?type=communityGuidelines"
      modalLabelText={t('registration.communityGuidelines')}
      testID="community-guidelines"
    />
  )
}

export default CommunityGuidelines
