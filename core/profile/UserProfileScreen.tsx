import React, { useContext, useState } from 'react'
import { View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import { LoginProtection } from '@holi/core/auth/screens/LoginProtection'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/user/UserContextProvider'
import { UserProfileForm } from '@holi/core/user/components/UserProfileForm'
import { UserProfileView } from '@holi/core/user/components/UserProfileView'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliChip from '@holi/ui/components/HoliChip'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export const UserProfileScreen: React.VFC = () => {
  const { navigate } = useRouting()
  const [editing, setEditing] = useState(false)
  const [chipChecked, setChipChecked] = useState(false)
  const toggleEditing = () => setEditing(!editing)

  const { isAuthenticated } = useContext(AuthContext)
  const { user } = useContext(UserContext)

  const { setNavigationHeader } = useNavigationHeader()
  const profileTitle = isAuthenticated && user ? user.firstName : 'Profile'
  setNavigationHeader({
    title: profileTitle,
    titleElement: () => (
      <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
        {profileTitle}
      </HoliText>
    ),
  })

  const loggedOutContent = <HoliText type={HoliTextType.heading1}>Log in to see your profile</HoliText>
  return (
    <LoginProtection loggedOutContent={loggedOutContent}>
      <View style={{ padding: 10, alignItems: 'center' }}>
        <HoliText type={HoliTextType.super}>Profile</HoliText>
        {editing ? (
          <UserProfileForm onCancel={toggleEditing} onSubmit={toggleEditing} />
        ) : (
          <UserProfileView editUser={() => toggleEditing()} />
        )}
        <View style={{ marginVertical: 10 }}>
          <HoliChip
            label="Nothing to do here"
            onPress={() => setChipChecked(!chipChecked)}
            checked={chipChecked}
            text="Example Interest"
          />
        </View>
        <HoliButton label="Logout" inline onPress={() => navigate('/logout')}>
          Logout
        </HoliButton>
      </View>
    </LoginProtection>
  )
}
