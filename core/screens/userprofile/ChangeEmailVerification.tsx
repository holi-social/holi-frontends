import React from 'react'

import EmailVerification from '@holi/core/screens/onboarding/steps/EmailVerification'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'

const ChangeEmailVerification = () => {
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerLeft: () => null,
      headerRight: () => null,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions])

  return <EmailVerification onSuccess={() => navigate('/profile')} />
}

export default ChangeEmailVerification
