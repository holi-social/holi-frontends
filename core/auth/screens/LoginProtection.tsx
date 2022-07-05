import React, { useContext } from 'react'
import { Text } from 'react-native'

import AuthLayout from '@holi/core/auth/AuthLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'

type LoginProtectionProps = {
  children?: React.ReactChild | React.ReactChildren
  loggedOutContent?: React.ReactChild | React.ReactChildren
}

const LoginProtection: React.VFC<LoginProtectionProps> = ({ children, loggedOutContent }: LoginProtectionProps) => {
  const { isLoggedIn } = useContext(AuthContext)
  const { navigate } = useRouting()

  if (isLoggedIn) {
    return <>{children}</>
  }

  return (
    <AuthLayout>
      {loggedOutContent || <Text>You’re not logged in</Text>}
      <HoliButton label="Open login form" inline onPress={() => navigate('/login')}>
        Login
      </HoliButton>
    </AuthLayout>
  )
}

export { LoginProtection }
