import { useMutation } from '@apollo/client'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserInputSchema,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { delayAnimation } from '@holi/ui/helper'
import { Position, usePositions } from '@holi/ui/helper'
import { colors } from '@holi/ui/styles/globalVars'

type UserProfileFormProps = {
  user: User
  onCancel: () => void
  onSubmit: (user: User) => void
  testId?: string
}

const onlyAllowedCharacters = (str: string) => str.replace(/[0-9<>]/g, '')

const UserProfileForm: React.VFC<UserProfileFormProps> = ({ onSubmit, user, ...props }) => {
  const [updateUser, { loading }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [aboutMe, setAboutMe] = useState(user?.aboutMe ?? '')
  const [pronouns, setPronouns] = useState(user?.pronouns ?? '')
  const [locationQuery, setLocationQuery] = useState(user?.location ?? '')
  const [location, setLocation] = useState<GeolocationSuggestion | undefined>(
    user?.location && user?.geolocation ? { label: user.location, id: '0', coordinates: user.geolocation } : undefined
  )
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const [pickedAvatar, setPickedAvatar] = useState<ImageInfo>()
  const scrollViewRef = useRef<ScrollView>(null)
  const { getScrollToProps } = usePositions()
  const { t } = useTranslation()
  const { handleGraphQLError } = useFieldErrors({
    i18nPrefix: 'user.profile',
    handledFieldErrors: ['firstName', 'lastName', 'aboutMe', 'pronouns', 'location'],
  })

  const testID = props.testId || 'user-profile-edit-form'

  const resetErrorsForField = useCallback(
    (fieldName: string) =>
      setFieldErrors((currentErrors: TranslatedFieldErrors) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [fieldName]: _, ...otherErrors } = currentErrors
        return otherErrors
      }),
    []
  )

  const submit = async () => {
    const input: UpdateAuthenticatedUserInput = {
      firstName,
      lastName,
      aboutMe,
      pronouns,
      location: location?.label,
      geolocation: location?.coordinates,
      ...(pickedAvatar?.blob ? { avatar: pickedAvatar.blob } : {}),
    }

    const resultSchema = UpdateAuthenticatedUserInputSchema.safeParse(input)
    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
      return
    }
    await updateUser({
      variables: { input },
      onCompleted: (data) => {
        if (onSubmit) {
          onSubmit(data.updateAuthenticatedUser)
        }
      },
      onError: (error) => setFieldErrors(handleGraphQLError(error)),
    })
  }

  let notificationComponent: React.ReactNode | null = null

  if (!user) {
    notificationComponent = (
      <View style={styles.notification}>
        <HoliText>{t('user.profileView.noUser')}</HoliText>
      </View>
    )
  }

  const header = (
    <View style={styles.headerContainer}>
      <HoliAvatar
        imageSrc={pickedAvatar?.uri ?? user?.avatar ?? ''}
        label={user?.firstName || ''}
        initials={user?.avatarLabel || ''}
        defaultColor={user?.avatarDefaultColor || '#FFAE86'}
        size="medium"
        style={styles.avatar}
      />

      <HoliImagePicker
        buttonProps={{
          label: t('profile.avatar.add'),
          transparent: true,
          inline: true,
        }}
        onPickImage={setPickedAvatar}
        maxFileSizeInMB={10}
      >
        <View style={styles.addImage}>
          <HoliText style={{ marginRight: 12 }}>{t('profile.avatar.add')}</HoliText>
          <HoliIcon icon="image" color={colors.foreground20} />
        </View>
      </HoliImagePicker>
    </View>
  )

  const prependComponent = (
    <>
      {notificationComponent}
      {header}
    </>
  )

  const onFocus = useCallback(
    (pos: Position) => {
      const scrollTo = scrollViewRef.current?.scrollTo
      const scrollOptions = { y: pos.y, animated: true }
      delayAnimation(scrollTo, scrollOptions, 16.6667) // 10000 ms / 60 fps
    },
    [scrollViewRef]
  )

  const scrollToPropsFor = (id: string) => getScrollToProps(id, onFocus)

  const onLocationClose = useCallback(
    (selectedSuggestion?: GeolocationSuggestion) => {
      setLocation(selectedSuggestion)

      if (!selectedSuggestion && locationQuery.length) {
        setFieldErrors({ location: [t('profile.location.validation.error')] })
      } else {
        resetErrorsForField('location')
      }
    },
    [resetErrorsForField, t, locationQuery]
  )

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.profileForm.save')}
      onActionButtonPress={submit}
      prependChildren={prependComponent}
      loading={loading}
      keyboardShouldPersistTaps="handled"
      hideFooterWhenKeyboardIsOpen={true}
      testID={testID}
      style={styles.wrapper}
      ref={scrollViewRef}
    >
      <View style={styles.mainContainer}>
        <HoliTextInput
          value={firstName}
          inputLabel={t('user.profileForm.firstName')}
          accessibilityLabel={t('user.profileForm.firstName')}
          placeholder={t('user.profileForm.firstNamePlaceholder')}
          maxNoOfCharacters={30}
          onChange={(text: string) => {
            setFirstName(onlyAllowedCharacters(text))
            resetErrorsForField('firstName')
          }}
          style={styles.input}
          validationErrorText={fieldErrors?.firstName?.join()}
          inputProps={{ autoFocus: Platform.OS === 'web' }}
          {...scrollToPropsFor('firstName')}
          testID={'first-name'}
        />
        <HoliTextInput
          value={lastName}
          inputLabel={t('user.profileForm.lastName')}
          accessibilityLabel={t('user.profileForm.lastName')}
          placeholder={t('user.profileForm.lastNamePlaceholder')}
          maxNoOfCharacters={30}
          onChange={(text: string) => {
            setLastName(onlyAllowedCharacters(text))
            resetErrorsForField('lastName')
          }}
          style={styles.input}
          validationErrorText={fieldErrors?.lastName?.join()}
          {...scrollToPropsFor('lastName')}
          testID={'last-name'}
        />
        <HoliTextInput
          value={aboutMe}
          inputLabel={t('user.profileForm.aboutMe')}
          accessibilityLabel={t('user.profileForm.aboutMe')}
          placeholder={t('user.profileForm.aboutMePlaceholder')}
          validationErrorText={fieldErrors?.aboutMe?.join()}
          onChange={(text: string) => {
            setAboutMe(text)
            resetErrorsForField('aboutMe')
          }}
          noOfVisibleLines={5}
          maxNoOfVisibleLines={10}
          maxNoOfCharacters={3000}
          {...scrollToPropsFor('aboutme')}
          style={styles.input}
        />
        <HoliTextInput
          value={pronouns}
          inputLabel={t('user.profileForm.pronouns')}
          accessibilityLabel={t('user.profileForm.pronouns')}
          placeholder={t('user.profileForm.pronounsPlaceholder')}
          validationErrorText={fieldErrors?.pronouns?.join()}
          onChange={(text: string) => {
            setPronouns(text)
            resetErrorsForField('pronouns')
          }}
          {...scrollToPropsFor('pronouns')}
          style={styles.input}
        />
        <PlacesAutocomplete
          label={t('user.profileForm.location')}
          placeholder={t('user.profileForm.locationPlaceholder')}
          id="user-location-input"
          testID="user-location"
          selected={location}
          value={locationQuery}
          onClose={onLocationClose}
          onChangeText={setLocationQuery}
          style={styles.input}
          suggestionsStyle={{ backgroundColor: colors.background10 }}
          helperText={location ? undefined : t('profile.location.validation.helper')}
          validationErrorText={fieldErrors?.location?.join()}
          withCoordinates
          {...scrollToPropsFor('location')}
        />
      </View>
    </HoliModalContentWrapper>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  mainContainer: {
    marginHorizontal: 24,
    marginTop: 30,
    paddingBottom: Platform.OS === 'ios' ? 250 : 0,
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
    borderColor: colors.foreground30,
    borderWidth: 2,
  },
  input: {
    marginBottom: 16,
  },
  notification: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    zIndex: 10,
    backgroundColor: colors.background10,
  },
})

export default UserProfileForm
