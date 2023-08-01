import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

const RegistrationButton = (props: Omit<HoliButtonProps, 'label'>) => {
  const { t } = useTranslation()
  const { replaceRoute } = useRouting()
  const { storedOnboardingState } = useStoredOnboardingState()

  return (
    <HoliButton
      onPress={() => {
        const profilePath = '/profile'
        const onboardingPath = Platform.OS === 'web' ? '/' : '/onboarding'
        const path = storedOnboardingState === 'finished' ? profilePath : onboardingPath
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
