import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

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
    return <HoliText>{t('user.profileView.noUser')}</HoliText>
  }

  if (loading) {
    return <HoliText>{t('user.profileForm.saving')}</HoliText>
  }

  if (error) {
    displayError(error, t('user.profileForm.error.saving'))
  }

  // Later: possibly use form tag for web
  return (
    <>
      <HoliText>{t('user.profileForm.name')}</HoliText>
      <TextInput value={firstName} onChangeText={setFirstName} />
      <TextInput value={lastName} onChangeText={setLastName} />
      <HoliButton label={t('user.profileForm.cancel')} onPress={onCancel}>
        {t('user.profileForm.cancel')}
      </HoliButton>
      <HoliButton label={t('user.profileForm.save')} onPress={submit}>
        {t('user.profileForm.save')}
      </HoliButton>
    </>
  )
}

export { UserProfileForm }
