import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { TextInput } from 'react-native'

import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { UserContext } from '@holi/core/user/UserContextProvider'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/user/queries'
import { User } from '@holi/core/user/types'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'

type UserProfileFormProps = {
  children?: React.ReactChildren
  onCancel?: () => void
  onSubmit?: (user: User) => void
}

const UserProfileForm: React.VoidFunctionComponent<UserProfileFormProps> = ({ onCancel, onSubmit }) => {
  const { user } = useContext(UserContext)
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const { displayError } = useErrorHandling()

  const submit = async () => {
    const input: UpdateAuthenticatedUserInput = {
      firstName: firstName,
      lastName: lastName,
    }
    const result = await updateUser({
      variables: {
        input: input,
      },
    })
    if (!error && result.data && onSubmit) {
      onSubmit(result.data.authenticatedUser)
    }
  }

  if (!user) {
    return <HoliText>No user fetched</HoliText>
  }

  if (loading) {
    return <HoliText>Saving...</HoliText>
  }

  if (error) {
    displayError(error, 'Error updating user')
  }

  // Later: possibly use form tag for web
  return (
    <>
      <HoliText>Name:</HoliText>
      <TextInput value={firstName} onChangeText={setFirstName} />
      <TextInput value={lastName} onChangeText={setLastName} />
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
