import React from 'react'
import { useTranslation } from 'react-i18next'

import AcceptDocumentLayout from '@holi/core/auth/components/AcceptDocumentLayout'
import CommunityGuidelinesDocument from '@holi/core/screens/communityGuidelines/CommunityGuidelinesDocument'

interface CommunityGuidelinesProps {
  onNextPress?: () => void
  onBackPress?: () => void
}

const CommunityGuidelines = ({ onNextPress, onBackPress }: CommunityGuidelinesProps) => {
  const { t } = useTranslation()

  return (
    <AcceptDocumentLayout
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      imageSource={require('@holi/ui/assets/img/illustrations/registration_community_guidelines.svg')}
      imageLabelText={t('registration.communityGuidelines.imageLabel')}
      headlineText={t('registration.communityGuidelines.heading')}
      descriptionText={t('registration.communityGuidelines.describtion')}
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
