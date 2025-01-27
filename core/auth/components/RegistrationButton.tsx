import React from 'react'
import { useTranslation } from 'react-i18next'

import { ButtonTracked } from '@holi/core/components/Trackable'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { TrackingEvent } from '@holi/core/tracking'
import type { ButtonProps } from 'holi-bricks/components/button'

type Props = Omit<ButtonProps, 'label'> & {
  replaceRoute?: boolean
  trackingEvent: TrackingEvent
}

const RegistrationButton = (props: Props) => {
  const { t } = useTranslation()
  const { navigate, replaceRoute } = useRouting()

  return (
    <ButtonTracked
      onPress={() => {
        const navFunction = props.replaceRoute ? replaceRoute : navigate
        navFunction('/onboarding')
      }}
      label={t('auth.loginProtection.registration')}
      variant={props.variant}
      testID="btn-to-registration-form"
      {...props}
    />
  )
}

export default RegistrationButton
