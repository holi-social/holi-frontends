import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { Text, TextInput } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import { updateUserMutation } from '@holi/core/user/queries'
import { User } from '@holi/core/user/types'
import Button from '@holi/ui/components/Button'
import GraphQLError from '@holi/ui/components/GraphQLError'

type UserProfileFormProps = {
  children?: React.ReactChildren
  onSubmit?: (user: User) => void
}

const UserProfileForm: React.VoidFunctionComponent<UserProfileFormProps> = ({ onSubmit }) => {
  const { user } = useContext(UserContext)
  // TODO(SF) keep here or move to UserContextProvider?
  const [updateUser, { loading, error, data }] = useMutation<User>(updateUserMutation)
  const [name, setName] = useState(user?.name || '')

  const submit = async () => {
    const result = await updateUser({
      variables: {
        id: user?.id,
        user: {
          name,
        },
      },
    })
    // TODO(SF) error handling?
    // TODO(SF) use data from result or hook?
    if (!error && result.data && onSubmit) {
      onSubmit(result.data)
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

  return (
    <>
      <Text>Name:</Text>
      <TextInput value={name} onChangeText={setName} />
      {errorComponent}
      <Button onPress={submit}>Save</Button>
    </>
  )
}

export { UserProfileForm }
