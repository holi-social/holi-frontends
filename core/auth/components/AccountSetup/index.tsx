import React from 'react'
import { SafeAreaView } from 'react-native'

import AccountSetup, { AccountSetupProps } from '@holi/core/auth/components/AccountSetup/AccountSetup'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const AccountSetupGuard = (props: AccountSetupProps) => {
  const { isLoading: isNewUserLoading } = useLoggedInUser()

  return isNewUserLoading ? (
    <SafeAreaView style={{ flex: 1 }}>
      <HoliLoader />
    </SafeAreaView>
  ) : (
    <AccountSetup {...props} />
  )
}

export default AccountSetupGuard
