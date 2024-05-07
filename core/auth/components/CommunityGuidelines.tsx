import React from 'react'
import { useTranslation } from 'react-i18next'

import AcceptDocumentLayout, { AgreementProps } from '@holi/core/auth/components/AcceptDocumentLayout'
import { getDocumentURL } from '@holi/core/helpers'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

interface CommunityGuidelinesProps extends AgreementProps {
  onNextPress?: () => void
  onBackPress?: () => void
}

const CommunityGuidelines = ({ onNextPress, onBackPress, ...agreementProps }: CommunityGuidelinesProps) => {
  const { t } = useTranslation()
  const termsOfUseModalHook = useModalState()
  const communityGuidelinesModalHook = useModalState()

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
      documents={[
        {
          url: getDocumentURL('termsOfUse'),
          navPath: '/profile/settings/legalDocuments/document?type=termsOfUse',
          modalHook: termsOfUseModalHook,
          modalLabelText: t('registration.communityGuidelines.modalLabel.termsOfUse'),
        },
        {
          url: getDocumentURL('communityGuidelines'),
          navPath: '/profile/settings/legalDocuments/document?type=communityGuidelines',
          modalHook: communityGuidelinesModalHook,
          modalLabelText: t('registration.communityGuidelines.modalLabel.communityGuidelines'),
        },
      ]}
      testID="community-guidelines"
    />
  )
}

export default CommunityGuidelines
