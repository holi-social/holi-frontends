import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { Text, TextInput } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import { updateUserMutation } from '@holi/core/user/queries'
import { User } from '@holi/core/user/types'
import GraphQLError from '@holi/ui/components/GraphQLError'
import HoliButton from '@holi/ui/components/HoliButton'

type UserProfileFormProps = {
  children?: React.ReactChildren
  onSubmit?: (user: User) => void
}

const UserProfileForm: React.VoidFunctionComponent<UserProfileFormProps> = ({ onSubmit }) => {
  const { user } = useContext(UserContext)
  const [updateUser, { loading, error, data }] = useMutation<User>(updateUserMutation)
  const [name, setName] = useState(user?.name || '')

  const submit = async () => {
    await updateUser({
      variables: {
        id: user?.id,
        user: {
          name,
        },
      },
    })
    if (!error && data && onSubmit) {
      onSubmit(data)
    }
  }

  if (!user) {
    return <Text>No user fetched</Text>
  }

  if (loading) {
    return <Text>Saving...</Text>
  }

  let errorComponent
  if (error) {
    console.error('Error updating user', error)
    errorComponent = <GraphQLError error={error} />
  }

  // Later: possibly use form tag for web
  return (
    <>
      <Text>Name:</Text>
      <TextInput value={name} onChangeText={setName} />
      {errorComponent}
      <HoliButton onPress={submit}>Save</HoliButton>
    </>
  )
}

export { UserProfileForm }
