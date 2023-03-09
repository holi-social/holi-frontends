import React from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'

export interface AlreadyHaveAccountTextProps {
  withReplacing?: boolean
  style?: StyleProp<ViewStyle>
}

const AlreadyHaveAccountText: React.VFC<AlreadyHaveAccountTextProps> = ({ withReplacing = false, style }) => {
  const { t } = useTranslation()

  return (
    <HoliText size="small" style={style} testID="already-have-account-text">
      <Trans t={t} i18nKey={'auth.registration.alreadyHasAccount'}>
        <HoliTextLink
          label={t('auth.login')}
          href="/login"
          size="small"
          mobileNavigateBackFirst={withReplacing}
          testID="btn-to-login-form"
        >
          {t('auth.login')}
        </HoliTextLink>
      </Trans>
    </HoliText>
  )
}

export default AlreadyHaveAccountText
