import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserInputSchema,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type UserProfileFormProps = {
  children?: React.ReactChildren
  onCancel?: () => void
  onSubmit?: (user: User) => void
}

const UserProfileForm: React.VoidFunctionComponent<UserProfileFormProps> = ({ onSubmit }) => {
  const { user } = useContext(UserContext)
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [aboutMe, setAboutMe] = useState(user?.aboutMe || '')
  const [pronouns, setPronouns] = useState(user?.pronouns || '')
  const [location, setLocation] = useState(user?.location || '')
  const [fieldErrors, setFieldErrors] = useState<{ [x: string]: string[] | undefined }>({})
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const { theme } = useTheme()
  const styles = getStyles(theme)

  const submit = async () => {
    const input: UpdateAuthenticatedUserInput = {
      ...(typeof firstName === 'string' && { firstName }),
      ...(typeof lastName === 'string' && { lastName }),
      ...(typeof aboutMe === 'string' && { aboutMe }),
      ...(typeof pronouns === 'string' && { pronouns }),
      ...(typeof location === 'string' && { location }),
    }

    const resultSchema = UpdateAuthenticatedUserInputSchema.safeParse(input)
    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
      return
    }
    const result = await updateUser({ variables: { input } })
    if (!error && result.data && onSubmit) {
      onSubmit(result.data.authenticatedUser)
    }
  }

  if (!user) {
    return (
      <View style={styles.wrapper}>
        <HoliText>{t('user.profileView.noUser')}</HoliText>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.wrapper}>
        <HoliText>{t('user.profileForm.saving')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('user.profileForm.error.saving'))
  }

  // Later: possibly use form tag for web
  return (
    <View style={styles.wrapper}>
      <HoliUserAvatar
        imageSrc={user.avatar}
        nameLabel={user.firstName || ''}
        initials={user.avatarLabel || ''}
        defaultColor={user.avatarDefaultColor || '#FFAE86'}
        size="medium"
        style={styles.avatar}
      />
      <View style={styles.addImage}>
        <HoliText style={{ marginRight: 13 }}>Add a profile image</HoliText>
        <HoliIcon icon={'image'} color={theme.colors.grey} />
      </View>
      <ScrollView style={styles.scrollView}>
        <HoliTextInput
          value={user.firstName}
          label={t('user.profileForm.firstName')}
          placeholder={t('user.profileForm.firstNamePlaceholder')}
          onChange={(text) => {
            setFirstName(text)
            setFieldErrors({ ...fieldErrors, ...{ firstName: undefined } })
          }}
          style={styles.input}
          validationErrorText={fieldErrors?.firstName?.join()}
        />
        <HoliTextInput
          value={user.lastName}
          label={t('user.profileForm.lastName')}
          placeholder={t('user.profileForm.lastNamePlaceholder')}
          onChange={(text) => {
            setLastName(text)
            setFieldErrors({ ...fieldErrors, ...{ lastName: undefined } })
          }}
          style={styles.input}
          validationErrorText={fieldErrors?.lastName?.join()}
        />
        <HoliTextInput
          value={user?.aboutMe}
          label={t('user.profileForm.aboutMe')}
          placeholder={t('user.profileForm.aboutMePlaceholder')}
          onChange={(text) => setAboutMe(text)}
          noOfLines={3}
          maxNoOfLines={3}
          style={styles.input}
        />
        <HoliTextInput
          value={user?.pronouns}
          label={t('user.profileForm.pronouns')}
          placeholder={t('user.profileForm.pronounsPlaceholder')}
          onChange={(text) => setPronouns(text)}
          style={styles.input}
        />
        <HoliTextInput
          value={user?.location}
          label={t('user.profileForm.location')}
          placeholder={t('user.profileForm.locationPlaceholder')}
          onChange={(text) => setLocation(text)}
          style={[styles.input, { paddingBottom: 100 }]}
        />
      </ScrollView>
      <HoliButton style={styles.saveButton} label={t('user.profileForm.save')} onPress={submit}>
        {t('user.profileForm.save')}
      </HoliButton>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    addImage: {
      flexDirection: 'row',
      marginTop: 16,
    },
    avatar: {
      borderColor: theme.colors.softblack,
      borderWidth: 2,
    },
    input: {
      marginBottom: 16,
    },
    scrollView: {
      marginTop: 24,
      paddingHorizontal: 8,
      flex: 1,
      width: '100%',
    },
    wrapper: {
      alignItems: 'center',
      alignSelf: 'center',
      flex: 1,
      maxWidth: 500,
      paddingHorizontal: 16,
      paddingBottom: 24,
      width: '100%',
    },
    saveButton: {
      bottom: 30,
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })

export default UserProfileForm
