import React, { useContext } from 'react'
import { Text } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import AuthLayout from '@holi/core/auth/AuthLayout'
import { getAuthenticatedSession, killAuthenticatedSession } from '@holi/core/auth/helpers/auth'
import { submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import HoliButton from '@holi/ui/components/HoliButton'
import useRouting from '@holi/ui/components/navigation/useRouting'

const Logout: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  const { setSession } = useContext(AuthContext)

  const onSubmit = () => {
    getAuthenticatedSession()
      .then((session) => {
        const payload = { session_token: session ? session.session_token : '' }
        submitLogoutFlow(payload)
      })
      .then(() => {
        setSession(null)
        console.info('[Logout.tsx] logout successful.')
        navigate('/')
      })
      .catch((e) => {
        killAuthenticatedSession()
        setSession(null)
        throw e
      })
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
