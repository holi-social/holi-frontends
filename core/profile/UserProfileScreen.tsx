import React, { useState } from 'react'
import { View } from 'react-native'

import { UserProfileForm } from '@holi/core/user/components/UserProfileForm'
import { UserProfileView } from '@holi/core/user/components/UserProfileView'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliHeading from '@holi/ui/components/HoliHeading'
import useRouting from '@holi/ui/components/navigation/useRouting'

export const UserProfileScreen: React.VFC = () => {
  const { navigate } = useRouting()
  const [editing, setEditing] = useState(false)
  const toggleEditing = () => setEditing(!editing)

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliHeading level={1}>Profile</HoliHeading>
      {editing ? (
        <UserProfileForm onCancel={toggleEditing} onSubmit={toggleEditing} />
      ) : (
        <UserProfileView editUser={() => toggleEditing()} />
      )}
      <HoliButton label="Login" inline onPress={() => navigate('/login')}>
        Login
      </HoliButton>
      <HoliButton label="Logout" inline onPress={() => navigate('/logout')}>
        Logout
      </HoliButton>
      <HoliButton label="Register" inline onPress={() => navigate('/registration')}>
        Register
      </HoliButton>
    </View>
  )
}
