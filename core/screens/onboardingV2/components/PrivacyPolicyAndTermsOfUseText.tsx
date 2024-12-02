import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Text } from 'holi-bricks/components/text'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { Platform } from 'react-native'

const isWeb = Platform.OS === 'web'
const isAndroid = Platform.OS === 'android'

const PrivacyPolicyAndTermsOfUseText = () => {
  const { t } = useTranslation()

  // in Web we navigate to the legal document page in profile settings
  // but on mobile we navigate to a scrren in the RootNavigator to open it as a modal
  const legalDocPath = isAndroid ? '/profile/settings/legalDocuments/document' : 'onboarding/legalDocuments'
  return (
    <Text size="sm" textAlign="center">
      <Trans t={t} i18nKey={'auth.registration.privacyPolicyAndTermsOfUse'}>
        <HoliTextLink
          label={t('auth.registration.privacyPolicy')}
          href={`${legalDocPath}?type=privacyPolicy`}
          size="sm"
          external={isWeb}
        />

        <HoliTextLink
          label={t('auth.registration.termsOfUse')}
          href={`${legalDocPath}?type=termsOfUse`}
          size="sm"
          external={isWeb}
        />
      </Trans>
    </Text>
  )
}

export default PrivacyPolicyAndTermsOfUseText
