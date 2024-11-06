import React from 'react'

import AccountSetup, { AccountSetupProps } from '@holi/core/auth/components/AccountSetup/AccountSetup'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const AccountSetupGuard = (props: AccountSetupProps) => {
  const { isLoading: isNewUserLoading } = useLoggedInUser()

  return isNewUserLoading ? (
    <SafeArea style={{ flex: 1 }}>
      <HoliLoader />
    </SafeArea>
  ) : (
    <AccountSetup {...props} />
  )
}

export default AccountSetupGuard
