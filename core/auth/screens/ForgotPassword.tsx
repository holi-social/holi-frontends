import { RecoveryFlow } from '@ory/kratos-client'
import React, { memo, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import RecoverPasswordCode from '@holi/core/auth/components/RecoverPasswordCode'
import RecoverPasswordForm from '@holi/core/auth/components/RecoverPasswordForm'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ArrowDownS, Close } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

const ForgotPassword = () => {
  const { t } = useTranslation()
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [flow, setFlow] = useState<RecoveryFlow>()
  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(
    () =>
      setScreenOptions({
        headerTitle: () => (
          <HoliHeading level="1" size="small">
            {t('auth.forgotPassword')}
          </HoliHeading>
        ),
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon={ArrowDownS} />),
        headerRight: () => (Platform.OS === 'web' ? <HeaderBackButton icon={Close} /> : null),
      }),
    [setScreenOptions, t]
  )

  const onSubmit = (success: boolean, flow?: RecoveryFlow, email?: string) => {
    setSuccess(success)
    if (flow) setFlow(flow)
    if (email) setEmail(email)
  }

  return (
    <DefaultLayout keyboardShouldPersistTaps="handled" headerOverlap={true}>
      <LoginRegistrationContainer style={{ paddingHorizontal: 24 }}>
        {success ? <RecoverPasswordCode email={email} flow={flow} /> : <RecoverPasswordForm onSubmit={onSubmit} />}
      </LoginRegistrationContainer>
    </DefaultLayout>
  )
}

export default memo(ForgotPassword)
