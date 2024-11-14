import React from 'react'
import { useTranslation } from 'react-i18next'

import { HoliButtonTracked } from '@holi/core/components/Trackable'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

type Props = Omit<HoliButtonProps, 'label'> & {
  replaceRoute?: boolean
  trackingEvent: TrackingEvent
}

const RegistrationButton = (props: Props) => {
  const { t } = useTranslation()
  const { navigate, replaceRoute } = useRouting()

  return (
    <HoliButtonTracked
      onPress={() => {
        const navFunction = props.replaceRoute ? replaceRoute : navigate
        navFunction('/onboarding/registration')
      }}
      label={t('auth.loginProtection.registration')}
      type="secondary"
      testID="btn-to-registration-form"
      {...props}
    >
      {t('auth.loginProtection.registration')}
    </HoliButtonTracked>
  )
}

export default RegistrationButton
