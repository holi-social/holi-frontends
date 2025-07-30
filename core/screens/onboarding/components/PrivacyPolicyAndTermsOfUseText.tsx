import React from 'react'
import { Platform } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'

import { Text } from 'holi-bricks/components/text'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'

const isWeb = Platform.OS === 'web'

interface PrivacyPolicyAndTermsOfUseTextProps {
  legalDocPath: string
}

const PrivacyPolicyAndTermsOfUseText = ({ legalDocPath }: PrivacyPolicyAndTermsOfUseTextProps) => {
  const { t } = useTranslation()

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
