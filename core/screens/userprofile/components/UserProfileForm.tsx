import { useMutation } from '@apollo/client'
import type React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type ScrollView, StyleSheet, View } from 'react-native'

import { IMAGE_MAX_FILE_SIZE_BYTES, PROFILE_IMAGE_MAX_WIDTH } from '@holi/core/constants/constants'
import type { User } from '@holi/core/domain/shared/types'
import { type FieldError, isMaliciousUrlError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, {
  GeolocationLevel,
  type GeolocationSuggestion,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { replaceSpecialChars } from '@holi/core/helpers'
import {
  type UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserInputSchema,
  type UpdateAuthenticatedUserV2Response,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import { Image } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, ToastProvider, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { type Position, delayAnimation, usePositions } from '@holi/ui/helper'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Avatar } from 'holi-bricks/components/avatar'

type UserProfileFormProps = {
  user: User
  onCancel: () => void
  onSubmit: (user: User) => void
  testId?: string
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit, user, ...props }) => {
  const { openToast } = useToast()

  const [updateUser, { loading }] = useMutation<UpdateAuthenticatedUserV2Response>(updateAuthenticatedUserV2Mutation)
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [aboutMe, setAboutMe] = useState(user?.aboutMe ?? '')
  const [pronouns, setPronouns] = useState(user?.pronouns ?? '')
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(
    user?.location && user?.geolocationId ? { label: user.location, id: user.geolocationId } : undefined
  )
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const [pickedAvatar, setPickedAvatar] = useState<HoliImageInfo>()
  const scrollViewRef = useRef<ScrollView>(null)
  const { getScrollToProps } = usePositions()
  const { t } = useTranslation()
  const { handleGraphQLError, translateFieldErrors } = useFieldErrors({
    i18nPrefix: 'user.profile',
    handledFieldErrors: ['firstName', 'lastName', 'aboutMe', 'pronouns', 'location'],
  })

  const testID = props.testId || 'user-profile-edit-form'

  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

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
      selectedLocation?.label !== user?.location
        ? {
            location: selectedLocation?.label || '',
            geolocation: selectedLocation?.geolocation,
          }
        : {}
    const input: UpdateAuthenticatedUserInput = {
      firstName,
      lastName,
      aboutMe,
      pronouns,
      ...locationUpdate,
      ...(pickedAvatar?.blob ? { avatar: pickedAvatar.blob } : {}),
    }

    const resultSchema = UpdateAuthenticatedUserInputSchema.safeParse(input)
    if (!resultSchema.success) {
      const { fieldErrors } = resultSchema.error.flatten<FieldError>()
      setFieldErrors(translateFieldErrors(fieldErrors))
      return
    }
    await updateUser({
      variables: { input },
      onCompleted: (data) => {
        if (onSubmit) {
          onSubmit(data.updateAuthenticatedUserV2)
        }
      },
      onError: (error) => {
        if (isMaliciousUrlError(error)) {
          openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
        } else {
          setFieldErrors(handleGraphQLError(error))
        }
      },
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

  const header = (
    <View style={[mixins.container, styles.headerContainer]}>
      <Avatar
        source={pickedAvatar?.uri || user?.avatar}
        imgPlaceholder={user.avatarBlurhash}
        label={user?.fullName || t('user.profileView.anonymous')}
        initials={user?.avatarLabel || ''}
        size="md"
      />

      <HoliImagePicker
        fileSizeLimitation={{
          type: 'resize',
          limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
          resizeWidth: PROFILE_IMAGE_MAX_WIDTH,
        }}
        buttonProps={{
          label: t('profile.avatar.add'),
          transparent: true,
          inline: true,
          icon: Image,
        }}
        onPickImage={setPickedAvatar}
      />
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
      if (scrollTo) delayAnimation(scrollTo, scrollOptions, 16.6667) // 10000 ms / 60 fps
    },
    [scrollViewRef]
  )

  const scrollToPropsFor = (id: string) => getScrollToProps(id, onFocus)

  const selectLocation = useCallback(
    (selectedSuggestion?: GeolocationSuggestion) => {
      setSelectedLocation(selectedSuggestion)
      resetErrorsForField('location')
    },
    [resetErrorsForField]
  )

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
        style={styles.wrapper}
        ref={scrollViewRef}
      >
        <View style={[mixins.container, styles.mainContainer]}>
          <HoliTextInput
            value={firstName}
            inputLabel={t('user.profileForm.firstName')}
            aria-label={t('user.profileForm.firstName')}
            placeholder={t('user.profileForm.firstNamePlaceholder')}
            maxNoOfCharacters={100}
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
            maxNoOfCharacters={100}
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
            onChange={selectLocation}
            style={styles.input}
            suggestionsStyle={{ backgroundColor: colors.background10 }}
            helperText={t('profile.location.validation.helper')}
            validationErrorText={fieldErrors?.location?.join()}
            level={GeolocationLevel.CITY}
            enhanceWithDetails
            {...scrollToPropsFor('location')}
          />
        </View>
      </HoliModalContentWrapper>
    </ToastProvider>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    mainContainer: {
      marginTop: 30,
      paddingBottom: Platform.OS === 'ios' ? 250 : 0,
    },
    headerContainer: {
      alignItems: 'center',
    },
    input: {
      marginBottom: 16,
    },
    notification: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      backgroundColor: theme.colors.background10,
    },
  })

export default UserProfileForm
