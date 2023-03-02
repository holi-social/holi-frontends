import React from 'react'
import { useTranslation } from 'react-i18next'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

const ButtonToRegistration: React.VFC<Omit<HoliButtonProps, 'label'>> = (props) => {
  const { t } = useTranslation()
  const { replaceRoute } = useUnifiedNavigation()
  const { finished } = useOnboarding()

  return (
    <HoliButton
      onPress={() => {
        const path = finished ? '/profile' : '/'
        replaceRoute(path + '?registrationStep=1')
      }}
      label={t('auth.loginProtection.registration')}
      type="secondary"
      testID="btn-to-registration-form"
      {...props}
    >
      {t('auth.loginProtection.registration')}
    </HoliButton>
  )
}

export default ButtonToRegistration
