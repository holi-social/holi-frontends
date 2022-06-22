import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { TextInput } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import { updateUserMutation } from '@holi/core/user/queries'
import { User } from '@holi/core/user/types'
import GraphQLError from '@holi/ui/components/GraphQLError'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'

type UserProfileFormProps = {
  children?: React.ReactChildren
  onCancel?: () => void
  onSubmit?: (user: User) => void
}

const UserProfileForm: React.VoidFunctionComponent<UserProfileFormProps> = ({ onCancel, onSubmit }) => {
  const { user } = useContext(UserContext)
  const [updateUser, { loading, error, data }] = useMutation<User>(updateUserMutation)
  const [firstName, setName] = useState(user?.firstName || '')

  const submit = async () => {
    const result = await updateUser({
      variables: {
        id: user?.id,
        user: {
          firstName,
        },
      },
    })
    if (!error && result.data && onSubmit) {
      onSubmit(result.data)
    }
  }

  if (!user) {
    return <HoliText>No user fetched</HoliText>
  }

  if (loading) {
    return <HoliText>Saving...</HoliText>
  }

  let errorComponent
  if (error) {
    console.error('Error updating user', error)
    errorComponent = <GraphQLError error={error} />
  }

  // Later: possibly use form tag for web
  return (
    <>
      <HoliText>Name:</HoliText>
      <TextInput value={firstName} onChangeText={setName} />
      {errorComponent}
      <HoliButton label="Profile data" onPress={onCancel}>
        Cancel
      </HoliButton>
      <HoliButton label="Profile data" onPress={submit}>
        Save
      </HoliButton>
    </>
  )
}

export { UserProfileForm }
