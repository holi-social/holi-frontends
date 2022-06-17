import React, { useContext } from 'react'
import { Text } from 'react-native'

import AuthLayout from '@holi/core/auth/AuthLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import HoliButton from '@holi/ui/components/HoliButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'

type LoginProtectionProps = {
  children?: React.ReactChild | React.ReactChildren
  loggedOutContent?: React.ReactChild | React.ReactChildren
}

const LoginProtection: React.VFC<LoginProtectionProps> = ({ children, loggedOutContent }: LoginProtectionProps) => {
  const { isAuthenticated } = useContext(AuthContext)
  const { navigate } = useRouting()

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <AuthLayout>
      {loggedOutContent || <Text>You’re not logged in</Text>}
      <HoliButton label="Login" inline onPress={() => navigate('/login')}>
        Login
      </HoliButton>
    </AuthLayout>
  )
}

export { LoginProtection }
