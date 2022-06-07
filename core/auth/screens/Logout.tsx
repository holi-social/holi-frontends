import React, { useContext, useState } from 'react'
import { Text } from 'react-native'

import AuthLayout from '@holi/core/auth/AuthLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { getAuthenticatedSession, removeSessionFromStore, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import HoliButton from '@holi/ui/components/HoliButton'
import useRouting from '@holi/ui/components/navigation/useRouting'

const Logout: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  const { setSession } = useContext(AuthContext)
  const [loggingOut, setLoggingOut] = useState(false)

  const onSubmit: () => Promise<void> = () => {
    const authenticatedSession = getAuthenticatedSession()
    setLoggingOut(true)
    return authenticatedSession
      .then((session) => {
        const payload = { session_token: session ? session.session_token : '' }
        return submitLogoutFlow(payload)
      })
      .then(() => {
        setSession(null)
        console.info('[Logout.tsx] logout successful.')
        navigate('/login')
        return Promise.resolve()
      })
      .catch((e) => {
        console.error('[Logout.tsx] error during logout', e)
        setSession(null)
        return removeSessionFromStore()
      })
      .finally(() => setLoggingOut(false))
  }
  return (
    <AuthLayout>
      <Text>Do you want to log out?</Text>
      <HoliButton label="" disabled={loggingOut} onPress={onSubmit}>
        Log out
      </HoliButton>
    </AuthLayout>
  )
}

export { Logout }
