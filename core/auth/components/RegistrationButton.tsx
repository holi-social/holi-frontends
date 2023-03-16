import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

const RegistrationButton = (props: Omit<HoliButtonProps, 'label'>) => {
  const { t } = useTranslation()
  const { replaceRoute } = useUnifiedNavigation()
  const { finished } = useOnboarding()

  return (
    <HoliButton
      onPress={() => {
        const profilePath = '/profile'
        const onboardingPath = Platform.OS === 'web' ? '/' : '/onboarding'
        const path = finished ? profilePath : onboardingPath
        replaceRoute(path + '?registrationStep=true')
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

export default RegistrationButton
