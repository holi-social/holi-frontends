import { useMutation } from '@apollo/client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import ImageUploader, { getAvatarSize } from '@holi/core/components/ImageUploader'
import { PROFILE_IMAGE_MAX_WIDTH } from '@holi/core/constants/constants'
import { FieldError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, {
  GeolocationLevel,
  GeolocationSuggestion,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { replaceSpecialChars } from '@holi/core/helpers'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserInputSchema,
  UpdateAuthenticatedUserResponse,
  authenticatedUserQuery,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { Position, delayAnimation, usePositions } from '@holi/ui/helper'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type UserProfileFormProps = {
  user: User
  onCancel: () => void
  onSubmit: (user: User) => void
  testId?: string
}

const UserProfileForm: React.VFC<UserProfileFormProps> = ({ onSubmit, user, ...props }) => {
  const [updateUser, { loading }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [aboutMe, setAboutMe] = useState(user?.aboutMe ?? '')
  const [pronouns, setPronouns] = useState(user?.pronouns ?? '')
  const [locationQuery, setLocationQuery] = useState(user?.location ?? '')
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(
    user?.location && user?.geolocationId ? { label: user.location, id: user.geolocationId } : undefined
  )
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const [currentImageUri, setCurrentImageUri] = useState<string>()
  const [pickedAvatar, setPickedAvatar] = useState<HoliImageInfo | null>()
  const handleImageUpload = (image: HoliImageInfo | null) => {
    setCurrentImageUri(image?.uri)
    setPickedAvatar(image)
  }
  useEffect(() => {
    setCurrentImageUri(user?.avatar)
  }, [user?.avatar])
  const scrollViewRef = useRef<ScrollView>(null)
  const { getScrollToProps } = usePositions()
  const { t } = useTranslation()
  const { width: deviceWidth } = useClientWindowDimensions()

  const { handleGraphQLError, translateFieldErrors } = useFieldErrors({
    i18nPrefix: 'user.profile',
    handledFieldErrors: ['firstName', 'lastName', 'aboutMe', 'pronouns', 'location'],
  })

  const testID = props.testId || 'user-profile-edit-form'

  const mixins = useStyleMixins()

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
    const locationUpdate =
      locationQuery !== user?.location
        ? {
            location: selectedLocation?.label || locationQuery,
            geolocation: selectedLocation?.geolocation,
          }
        : {}
    const input: UpdateAuthenticatedUserInput = {
      firstName,
      lastName,
      aboutMe,
      pronouns,
      ...locationUpdate,
      avatar: pickedAvatar?.blob ?? null,
    }

    const resultSchema = UpdateAuthenticatedUserInputSchema.safeParse(input)
    if (!resultSchema.success) {
      const { fieldErrors } = resultSchema.error.flatten<FieldError>()
      setFieldErrors(translateFieldErrors(fieldErrors))
      return
    } else if (locationQuery.length && !selectedLocation) {
      setFieldErrors({ location: [t('profile.location.validation.error')] })
      return
    }
    await updateUser({
      variables: { input },
      refetchQueries: [{ query: authenticatedUserQuery, fetchPolicy: 'network-only' }],
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
      <View style={[mixins.container, styles.notification]}>
        <HoliText>{t('user.profileView.noUser')}</HoliText>
      </View>
    )
  }

  const fullName = user.fullName || t('user.profileView.anonymous')

  const header = (
    <ImageUploader
      style={styles.header}
      imageLabel={t('user.profileView.avatar.input.label')}
      image={pickedAvatar}
      onUploadImage={handleImageUpload}
      currentImageUri={currentImageUri}
      previewVariant="avatar"
      placeholder={
        <HoliAvatar
          label={fullName}
          initials={user.avatarLabel}
          defaultColor={user.avatarDefaultColor}
          size={getAvatarSize(deviceWidth).size}
        />
      }
      resizeWidth={PROFILE_IMAGE_MAX_WIDTH}
    />
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
      scrollTo && delayAnimation(scrollTo, scrollOptions, 16.6667) // 10000 ms / 60 fps
    },
    [scrollViewRef]
  )

  const scrollToPropsFor = (id: string) => getScrollToProps(id, onFocus)

  const onLocationClose = useCallback(
    (selectedSuggestion?: GeolocationSuggestion) => {
      setSelectedLocation(selectedSuggestion)

      if (!selectedSuggestion && locationQuery.length) {
        setFieldErrors({ location: [t('profile.location.validation.error')] })
      } else {
        resetErrorsForField('location')
      }
    },
    [resetErrorsForField, t, locationQuery]
  )

  // @ts-ignore
  return (
    <ToastProvider>
      <HoliModalContentWrapper
        actionButtonText={t('user.profileForm.save')}
        onActionButtonPress={submit}
        prependChildren={prependComponent}
        loading={loading}
        keyboardShouldPersistTaps="handled"
        hideFooterWhenKeyboardIsOpen={true}
        testID={testID}
        style={[styles.wrapper, styles.contentBackground]}
        footerStyle={styles.contentBackground}
        ref={scrollViewRef}
      >
        <View style={styles.contentBackground}>
          <View style={[mixins.container, styles.mainContainer]}>
            <HoliTextInput
              value={firstName}
              inputLabel={t('user.profileForm.firstName')}
              aria-label={t('user.profileForm.firstName')}
              placeholder={t('user.profileForm.firstNamePlaceholder')}
              maxNoOfCharacters={30}
              onChange={(text: string) => {
                setFirstName(replaceSpecialChars(text))
                resetErrorsForField('firstName')
              }}
              isRequired
              style={styles.input}
              validationErrorText={fieldErrors?.firstName?.join()}
              inputProps={{ autoFocus: Platform.OS === 'web' }}
              {...scrollToPropsFor('firstName')}
              testID={'first-name'}
            />
            <HoliTextInput
              value={lastName}
              inputLabel={t('user.profileForm.lastName')}
              aria-label={t('user.profileForm.lastName')}
              placeholder={t('user.profileForm.lastNamePlaceholder')}
              maxNoOfCharacters={30}
              onChange={(text: string) => {
                setLastName(replaceSpecialChars(text))
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
              aria-label={t('user.profileForm.aboutMe')}
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
              aria-label={t('user.profileForm.pronouns')}
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
              selected={selectedLocation}
              value={locationQuery}
              onClose={onLocationClose}
              onChangeText={setLocationQuery}
              style={styles.input}
              suggestionsStyle={{ backgroundColor: colors.background10 }}
              helperText={selectedLocation ? undefined : t('profile.location.validation.helper')}
              validationErrorText={fieldErrors?.location?.join()}
              level={GeolocationLevel.CITY}
              fetchDetailsOnClose
              {...scrollToPropsFor('location')}
            />
          </View>
        </View>
      </HoliModalContentWrapper>
    </ToastProvider>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    maxWidth: 'auto',
  },
  header: {
    backgroundColor: colors.background10,
  },
  contentBackground: {
    backgroundColor: colors.background20,
  },
  mainContainer: {
    paddingBottom: Platform.OS === 'ios' ? 250 : 0,
    marginTop: 30,
  },
  input: {
    marginBottom: 16,
  },
  notification: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: colors.background10,
  },
})

export default UserProfileForm
