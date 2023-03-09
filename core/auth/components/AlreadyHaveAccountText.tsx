import React from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'

export interface AlreadyHaveAccountTextProps {
  mobileNavigateBackFirst?: boolean
  style?: StyleProp<ViewStyle>
}

const AlreadyHaveAccountText: React.VFC<AlreadyHaveAccountTextProps> = ({ mobileNavigateBackFirst = false, style }) => {
  const { t } = useTranslation()

  return (
    <HoliText size="small" style={style} testID="already-have-account-text">
      <Trans t={t} i18nKey={'auth.registration.alreadyHasAccount'}>
        <HoliTextLink
          label={t('auth.login')}
          href="/login"
          size="small"
          mobileNavigateBackFirst={mobileNavigateBackFirst}
          testID="btn-to-login-form"
        />
      </Trans>
    </HoliText>
  )
}

export default AlreadyHaveAccountText
