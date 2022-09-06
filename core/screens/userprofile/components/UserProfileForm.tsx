import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserInputSchema,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

type UserProfileFormProps = {
  user: User
  onCancel: () => void
  onSubmit: (user: User) => void
  testId?: string
}

const onlyLettersAndSpaces = (str: string) => str.replace(/[^\p{L}\s]/gu, '')

const UserProfileForm: React.VFC<UserProfileFormProps> = ({ onSubmit, user, ...props }) => {
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [aboutMe, setAboutMe] = useState(user?.aboutMe ?? '')
  const [pronouns, setPronouns] = useState(user?.pronouns ?? '')
  const [location, setLocation] = useState(user?.location ?? '')
  const [fieldErrors, setFieldErrors] = useState<{ [x: string]: string[] | undefined }>({})
  const { t } = useTranslation()

  const testID = props.testId || 'user-profile-edit-form'

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

  let notificationComponent: React.ReactNode | null = null

  if (!user) {
    notificationComponent = (
      <View style={styles.notification}>
        <HoliText>{t('user.profileView.noUser')}</HoliText>
      </View>
    )
  }

  if (loading) {
    notificationComponent = (
      <View style={styles.notification} testID={`${testID}-saving`}>
        <HoliText>{t('user.profileForm.saving')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('user.profileForm.error.saving'))
  }

  const header = (
    <View style={styles.headerContainer}>
      <HoliUserAvatar
        imageSrc={user?.avatar || ''}
        label={user?.firstName || ''}
        initials={user?.avatarLabel || ''}
        defaultColor={user?.avatarDefaultColor || '#FFAE86'}
        size="medium"
        style={styles.avatar}
      />

      <View style={styles.addImage}>
        <HoliText style={{ marginRight: 13 }}>Add a profile image</HoliText>
        <HoliIcon icon="image" color={colors.fontColorGrey} />
      </View>
    </View>
  )

  const prependComponent = (
    <>
      {notificationComponent}
      {header}
    </>
  )

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.profileForm.save')}
      onActionButtonPress={submit}
      prependChildren={prependComponent}
      testID={testID}
    >
      <View style={styles.mainContainer}>
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
          style={styles.input}
        />
      </View>
    </HoliModalContentWrapper>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
  },
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
    width: '100%',
    paddingBottom: 150,
  },
  notification: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    zIndex: 10,
    backgroundColor: colors.backgroundColorWhite,
  },
})

export default UserProfileForm
