import React from 'react'

// import { useTranslation } from 'react-i18next'
import EmailVerification from '@holi/core/auth/components/AccountSetup/EmailVerification'
import useRouting from '@holi/core/navigation/hooks/useRouting'

const ChangeEmailVerification = () => {
  const { navigate } = useRouting()

  return <EmailVerification onSuccess={() => navigate('/profile')} />
}

export default ChangeEmailVerification
