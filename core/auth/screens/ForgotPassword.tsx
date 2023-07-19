import React, { memo, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import RecoverPasswordForm from '@holi/core/auth/components/RecoverPasswordForm'
import RecoverPasswordSent from '@holi/core/auth/components/RecoverPasswordSent'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ArrowDownS, Close } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

const ForgotPassword = () => {
  const { t } = useTranslation()
  const [success, setSuccuss] = useState(false)
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

  return (
    <DefaultLayout keyboardShouldPersistTaps="handled" headerOverlap={true}>
      <LoginRegistrationContainer style={{ paddingHorizontal: 24 }}>
        {success ? <RecoverPasswordSent /> : <RecoverPasswordForm onSubmit={setSuccuss} />}
      </LoginRegistrationContainer>
    </DefaultLayout>
  )
}

export default memo(ForgotPassword)
