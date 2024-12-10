import React from 'react'
import PrivacyPolicyAndTermsOfUseText from '@holi/core/screens/onboarding/components/PrivacyPolicyAndTermsOfUseText'
import { Platform, View } from 'react-native'
import { DocumentModal, useDocumentModal } from '@holi/core/screens/onboarding/components/DocumentModal'
import { ImprintFooter } from '@holi/core/screens/onboarding/components/ImprintFooter'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'

interface DocumentsFooterProps {
  displayImprint?: boolean
}

const isWeb = Platform.OS === 'web'

export const DocumentsFooter = ({ displayImprint = false }: DocumentsFooterProps) => {
  const { show: showDocModal, modalProps } = useDocumentModal()

  // in Web we navigate to the legal document page in profile settings
  // but on mobile we navigate to a screen in the RootNavigator to open it as a modal
  const legalDocPath = isWeb ? '/profile/settings/legalDocuments/document' : 'onboarding/legalDocuments'

  return (
    <View>
      <PrivacyPolicyAndTermsOfUseText legalDocPath={legalDocPath} showDocModal={showDocModal} />

      {displayImprint && (
        <>
          <HoliGap size="m" />
          <ImprintFooter legalDocPath={legalDocPath} showDocModal={showDocModal} />
        </>
      )}

      <DocumentModal {...modalProps} />
    </View>
  )
}
