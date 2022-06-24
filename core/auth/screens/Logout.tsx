import React, { useContext } from 'react'
import { Text } from 'react-native'

import AuthLayout from '@holi/core/auth/AuthLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { getAuthenticatedSession, killAuthenticatedSession } from '@holi/core/auth/helpers/auth'
import { submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import useErrorHandling from '@holi/core/errors/useErrorHandling'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'

const Logout: React.VoidFunctionComponent = () => {
  const { navigateBack } = useRouting()
  const { setSession } = useContext(AuthContext)
  const { displayError } = useErrorHandling()

  const onSubmit = () => {
    getAuthenticatedSession()
      .then((session) => {
        const payload = { session_token: session ? session.session_token : '' }
        submitLogoutFlow(payload)
      })
      .then(() => {
        setSession(null)
        console.info('[Logout.tsx] logout successful.')
        navigateBack()
      })
      .catch((e) => {
        killAuthenticatedSession()
        setSession(null)
        throw e
      })
      .catch((error) => displayError(error, 'Logout failed'))
  }
  return (
    <AuthLayout>
      <Text>Do you want to log out?</Text>
      <HoliButton label="" onPress={() => onSubmit()}>
        Log out
      </HoliButton>
    </AuthLayout>
  )
}

export { Logout }
