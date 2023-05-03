import React from 'react'
import { useTranslation } from 'react-i18next'

import AcceptDocumentLayout, { AgreementProps } from '@holi/core/auth/components/AcceptDocumentLayout'
import CommunityGuidelinesDocument from '@holi/core/screens/communityGuidelines/CommunityGuidelinesDocument'

interface CommunityGuidelinesProps extends AgreementProps {
  onNextPress?: () => void
  onBackPress?: () => void
}

const CommunityGuidelines = ({ onNextPress, onBackPress, ...agreementProps }: CommunityGuidelinesProps) => {
  const { t } = useTranslation()

  return (
    <AcceptDocumentLayout
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      {...agreementProps}
      imageSource={require('@holi/ui/assets/img/illustrations/registration_community_guidelines.svg')}
      imageLabelText={t('registration.communityGuidelines.imageLabel')}
      headlineText={t('registration.communityGuidelines.heading')}
      descriptionText={t('registration.communityGuidelines.description')}
      checkboxLabelTranslation="registration.communityGuidelines.checkboxLabel"
      documentNavPath="/communityGuidelines"
      modalLabelText={t('registration.communityGuidelines')}
      testID="community-guidelines"
    >
      <CommunityGuidelinesDocument />
    </AcceptDocumentLayout>
  )
}

export default CommunityGuidelines
