import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserInputSchema,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

type UserProfileFormProps = {
  onCancel: () => void
  onSubmit: (user: User) => void
  testId?: string
}

const onlyLettersAndSpaces = (str: string) => str.replace(/[^\p{L}\s]/gu, '')

const UserProfileForm: React.VFC<UserProfileFormProps> = ({ onSubmit, ...props }) => {
  const { user } = useContext(UserContext)
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [aboutMe, setAboutMe] = useState(user?.aboutMe ?? '')
  const [pronouns, setPronouns] = useState(user?.pronouns ?? '')
  const [location, setLocation] = useState(user?.location ?? '')
  const [fieldErrors, setFieldErrors] = useState<{ [x: string]: string[] | undefined }>({})
  const { t } = useTranslation()

  const submit = async () => {
    const input: UpdateAuthenticatedUserInput = {
      firstName,
      lastName,
      aboutMe,
      pronouns,
      location,
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
      <View style={styles.wrapper} testID="user-profile-edit-form-saving">
        <HoliText>{t('user.profileForm.saving')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('user.profileForm.error.saving'))
  }

  // Later: possibly use form tag for web
  return (
    <View style={styles.wrapper} testID={props?.testId || 'user-profile-edit-form'}>
      <HoliUserAvatar
        imageSrc={user.avatar}
        label={user.firstName || ''}
        initials={user.avatarLabel || ''}
        defaultColor={user.avatarDefaultColor || '#FFAE86'}
        size="medium"
        style={styles.avatar}
      />
      <View style={styles.addImage}>
        <HoliText style={{ marginRight: 13 }}>Add a profile image</HoliText>
        <HoliIcon icon="image" color={colors.grey} />
      </View>
      <ScrollView style={styles.scrollView}>
        <HoliTextInput
          value={firstName}
          inputLabel={t('user.profileForm.firstName')}
          accessibilityLabel={t('user.profileForm.firstName')}
          placeholder={t('user.profileForm.firstNamePlaceholder')}
          maxNoOfCharacters={30}
          onChange={(text) => {
            setFirstName(onlyLettersAndSpaces(text))
            setFieldErrors((currentErrors) => ({ ...currentErrors, ...{ firstName: undefined } }))
          }}
          style={styles.input}
          validationErrorText={fieldErrors?.firstName?.join()}
          testID={'first-name'}
          inputProps={{ autoFocus: Platform.OS === 'web' }}
        />
        <HoliTextInput
          value={lastName}
          inputLabel={t('user.profileForm.lastName')}
          accessibilityLabel={t('user.profileForm.lastName')}
          placeholder={t('user.profileForm.lastNamePlaceholder')}
          maxNoOfCharacters={30}
          onChange={(text) => {
            setLastName(onlyLettersAndSpaces(text))
            setFieldErrors((currentErrors) => ({ ...currentErrors, ...{ lastName: undefined } }))
          }}
          style={styles.input}
          validationErrorText={fieldErrors?.lastName?.join()}
          testID={'last-name'}
        />
        <HoliTextInput
          value={aboutMe}
          inputLabel={t('user.profileForm.aboutMe')}
          accessibilityLabel={t('user.profileForm.aboutMe')}
          placeholder={t('user.profileForm.aboutMePlaceholder')}
          onChange={(text) => setAboutMe(text)}
          noOfVisibleLines={5}
          maxNoOfVisibleLines={10}
          maxNoOfCharacters={3000}
          style={styles.input}
        />
        <HoliTextInput
          value={pronouns}
          inputLabel={t('user.profileForm.pronouns')}
          accessibilityLabel={t('user.profileForm.pronouns')}
          placeholder={t('user.profileForm.pronounsPlaceholder')}
          onChange={(text) => setPronouns(text)}
          style={styles.input}
        />
        <HoliTextInput
          value={location}
          inputLabel={t('user.profileForm.location')}
          accessibilityLabel={t('user.profileForm.location')}
          placeholder={t('user.profileForm.locationPlaceholder')}
          onChange={(text) => setLocation(text)}
          style={[styles.input, { paddingBottom: 100 }]}
        />
      </ScrollView>
      <HoliButton
        style={styles.saveButton}
        label={t('user.profileForm.save')}
        onPress={submit}
        testID={`btn-${props?.testId || 'user-profile-edit-form'}-save`}
      >
        {t('user.profileForm.save')}
      </HoliButton>
    </View>
  )
}

const styles = StyleSheet.create({
  addImage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  avatar: {
    borderColor: colors.softblack,
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
