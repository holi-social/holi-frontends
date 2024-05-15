import React from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

type Props = Omit<HoliButtonProps, 'label'> & {
  replaceRoute?: boolean
}

const RegistrationButton = (props: Props) => {
  const { t } = useTranslation()
  const { navigate, replaceRoute } = useRouting()

  return (
    <HoliButton
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
    </HoliButton>
  )
}

export default RegistrationButton
