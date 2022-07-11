import React, { useContext, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { LoginProtection } from '@holi/core/auth/components/LoginProtection'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import LoggedOutView from '@holi/core/profile/LoggedOutView'
import { UserContext } from '@holi/core/user/UserContextProvider'
import { UserProfileForm } from '@holi/core/user/components/UserProfileForm'
import { UserProfileView } from '@holi/core/user/components/UserProfileView'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliChip from '@holi/ui/components/HoliChip'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'

export const UserProfileScreen: React.VFC = () => {
  const { navigate } = useRouting()
  const [editing, setEditing] = useState(false)
  const [chipChecked, setChipChecked] = useState(false)
  const toggleEditing = () => setEditing(!editing)
  const { t } = useTranslation()

  const { isLoggedIn } = useContext(AuthContext)
  const { user } = useContext(UserContext)

  const { setNavigationHeader } = useNavigationHeader()

  useLayoutEffect(() => {
    const profileTitle = isLoggedIn && user ? user.firstName : t('profile.title')
    setNavigationHeader({
      title: profileTitle,
      titleElement: () => <HoliText style={{ paddingTop: 5 }}>{profileTitle}</HoliText>,
    })
  }, [isLoggedIn])

  return (
    <DefaultLayout>
      <LoginProtection loggedOutContent={<LoggedOutView />}>
        <View style={{ paddingVertical: 24, paddingHorizontal: 16, alignItems: 'center' }}>
          <HoliHeading level="1" size="super">
            {t('profile.title')}
          </HoliHeading>
          {editing ? (
            <UserProfileForm onCancel={toggleEditing} onSubmit={toggleEditing} />
          ) : (
            <UserProfileView editUser={() => toggleEditing()} />
          )}
          <View style={{ marginVertical: 10 }}>
            <HoliChip
              label={t('profile.exampleInterest')}
              onPress={() => setChipChecked(!chipChecked)}
              checked={chipChecked}
              text={t('profile.exampleInterest')}
            />
          </View>
          <HoliButton label={t('profile.logout')} inline onPress={() => navigate('/logout')}>
            {t('profile.logout')}
          </HoliButton>
        </View>
      </LoginProtection>
    </DefaultLayout>
  )
}
