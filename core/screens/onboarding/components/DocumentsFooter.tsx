import React from 'react'
import PrivacyPolicyAndTermsOfUseText from '@holi/core/screens/onboarding/components/PrivacyPolicyAndTermsOfUseText'
import { Platform } from 'react-native'
import { ImprintFooter } from '@holi/core/screens/onboarding/components/ImprintFooter'
import { Stack } from 'holi-bricks/components/stack'

interface DocumentsFooterProps {
  displayImprint?: boolean
}

const isWeb = Platform.OS === 'web'

export const DocumentsFooter = ({ displayImprint = false }: DocumentsFooterProps) => {
  // we could align the mobile structure to the web structure now.
  const legalDocPath = isWeb ? '/profile/settings/legalDocuments/document' : '/onboarding/legalDocuments'

  return (
    <Stack gap="3xs" direction="column">
      <PrivacyPolicyAndTermsOfUseText legalDocPath={legalDocPath} />

      {displayImprint && <ImprintFooter legalDocPath={legalDocPath} />}
    </Stack>
  )
}
