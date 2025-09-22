import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { useLogout } from '@holi/core/helpers'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Text } from 'holi-bricks/components/text'

const Logout = () => {
  const { t } = useTranslation()
  const { logout } = useLogout()
  const { isLoggedIn } = useLoggedInUser()

  useEffect(() => {
    if (isLoggedIn) {
      logout()
    }
  }, [logout, isLoggedIn])

  return (
    <DefaultLayout>
      <HoliContainer alignItems="center">
        <HoliBox padding={[dimensions.topBarHeight + 50, 0, 0, 0]}>
          <Text>{isLoggedIn ? t('oauth2.logout') : t('oauth2.loggedOut')}</Text>
        </HoliBox>
      </HoliContainer>
    </DefaultLayout>
  )
}

export default Logout
