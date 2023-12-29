import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Image as ReactNativeImage } from 'react-native'

import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { PermissionsType } from '@holi/core/screens/appointments/types'
import { VisibilityType } from '@holi/core/screens/spaces/types'
import { GeolocationPoint } from '@holi/core/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Global, LinkM, Lock, Team } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliDatePicker from '@holi/ui/components/organisms/HoliDatePicker'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect, { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors } from '@holi/ui/styles/globalVars'

// this enum is only used for the HoliModalSelect, since inviteOnly is a boolean value
export enum INVITE_ONLY_TYPE {
  INVITE_ONLY = 'INVITE_ONLY',
  PUBLIC = 'PUBLIC',
}

export const INVITE_ONLY_OPTIONS: HoliModalSelectOption[] = [
  {
    id: INVITE_ONLY_TYPE.PUBLIC,
    title: 'Public',
    selected: true,
    icon: Global,
  },
  {
    id: INVITE_ONLY_TYPE.INVITE_ONLY,
    title: 'Members',
    selected: false,
    icon: Lock,
  },
]

export const PERMISSION_TYPE_OPTIONS: HoliModalSelectOption[] = [
  {
    id: PermissionsType.PARTICIPANTS,
    title: 'Members',
    selected: true,
    icon: Team,
  },
  {
    id: PermissionsType.ADMINS,
    title: 'Admins',
    selected: false,
    icon: Lock, // TODO: Add admin icon
  },
]

export interface AppointmentInputFormProps {
  title: string
  description: string
  inviteOnly?: HoliModalSelectOption
  startDate?: string
  endDate?: string
  permissionType?: HoliModalSelectOption
  regularity?: HoliModalSelectOption
  thumbnail?: HoliImageInfo
  thumbnailBlurhash?: string
  geolocation?: GeolocationPoint
  selectedLocation?: GeolocationSuggestion
  currentThumbnail?: string
  onChangeTitle: (_: string) => void
  onChangeDescription: (_: string) => void
  onChangeInviteOnly: (_: HoliModalSelectOption) => void
  onChangeStartDate: (_: string) => void
  onChangeEndDate: (_: string) => void
  onChangePermissionType: (_: HoliModalSelectOption) => void
  onChangeThumbnail: (_: HoliImageInfo | undefined) => void
  onChangeGeolocation: (_: GeolocationPoint) => void
  onChangeSelectedLocation: (_: GeolocationSuggestion) => void
  fieldErrors?: TranslatedFieldErrors
  isAdmin?: boolean
}

const AppointmentInputForm: React.VFC<AppointmentInputFormProps> = ({
  title,
  description,
  inviteOnly,
  startDate,
  endDate,
  permissionType,
  thumbnail,
  currentThumbnail,
  selectedLocation,
  onChangeTitle,
  onChangeDescription,
  onChangeInviteOnly,
  onChangeStartDate,
  onChangeEndDate,
  onChangePermissionType,
  onChangeThumbnail,
  onChangeSelectedLocation,
  fieldErrors = {},
  isAdmin,
}: AppointmentInputFormProps) => {
  const [inviteOnlyOptions, setInviteOnlyOptions] = useState<HoliModalSelectOption[]>(INVITE_ONLY_OPTIONS)
  const [permissionTypeOptions, setPermissionTypeOptions] = useState<HoliModalSelectOption[]>(PERMISSION_TYPE_OPTIONS)

  const [titleError, setTitleError] = useState<string | undefined>()
  const [descriptionError, setDescriptionError] = useState<string | undefined>()

  const { t } = useTranslation()

  // set options translations
  useEffect(() => {
    setInviteOnlyOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`spaces.appointments.input.inviteOnly.${option.id}.title`),
        description: t(`spaces.appointments.input.inviteOnly.${option.id}.description`),
        disabled: !isAdmin && option.id === VisibilityType.PUBLIC ? true : false,
      }))
    )

    setPermissionTypeOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`spaces.appointments.input.permission.${option.id}.title`),
        description: t(`spaces.appointments.input.permission.${option.id}.description`),
      }))
    )
  }, [t, setInviteOnlyOptions, setPermissionTypeOptions, isAdmin])

  useEffect(() => {
    setTitleError(fieldErrors?.title?.length ? fieldErrors.title[0] : undefined)
    setDescriptionError(fieldErrors?.description?.length ? fieldErrors.description[0] : undefined)
  }, [fieldErrors, t])

  useEffect(() => {
    if (inviteOnly) {
      setInviteOnlyOptions((options) =>
        options.map((visibilityOption) =>
          visibilityOption.title === inviteOnly.title
            ? { ...visibilityOption, selected: true }
            : { ...visibilityOption, selected: false }
        )
      )
    }
    if (permissionType) {
      setPermissionTypeOptions((options) =>
        options.map((locationTypeOption) =>
          locationTypeOption.title === permissionType.title
            ? { ...locationTypeOption, selected: true }
            : { ...locationTypeOption, selected: false }
        )
      )
    }
  }, [inviteOnly, permissionType])

  return (
    <>
      <HoliTextInput
        placeholder={t('spaces.appointments.input.title.placeholder')}
        inputLabel={t('spaces.appointments.input.title.label')}
        validationErrorText={titleError}
        value={title}
        onChange={onChangeTitle}
        aria-label={t('spaces.appointments.input.title.label')}
        testID="appointment-title"
        isRequired
        showCharacterCount
        maxNoOfCharacters={40}
        inputProps={{ autoFocus: true }}
      />

      <HoliModalSelect
        options={inviteOnlyOptions}
        title={t('spaces.appointments.input.inviteOnly.title')}
        onChange={onChangeInviteOnly}
        placeholder={t('spaces.appointments.input.inviteOnly.placeholder')}
        label={t('spaces.appointments.input.inviteOnly.title')}
        testID="appointment-invite-only-input"
        style={styles.marginSeparator}
        showOptionIcon
        isRequired
      />

      <View style={styles.sectionWrapper}>
        <HoliDatePicker
          onChange={onChangeStartDate}
          title={t('spaces.appointments.input.startDate.title')}
          label={t('spaces.appointments.input.startDate.title')}
          value={startDate}
          isRequired
        />

        <HoliDatePicker
          style={styles.marginSeparator}
          onChange={onChangeEndDate}
          title={t('spaces.appointments.input.endDate.title')}
          label={t('spaces.appointments.input.endDate.title')}
          value={endDate}
          isRequired
        />
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 3 }]}>
        <PlacesAutocomplete
          label={t('spaces.input.location.label')}
          placeholder={t('spaces.input.location.placeholder')}
          selected={selectedLocation}
          value={selectedLocation?.label}
          id="appointment-location"
          testID="appointment-location"
          onChange={onChangeSelectedLocation}
          onSubmit={onChangeSelectedLocation}
          style={{ zIndex: 1 }}
        />
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 1 }]}>
        <HoliTextInput
          placeholder={t('spaces.appointments.input.description.placeholder')}
          inputLabel={t('spaces.appointments.input.description.label')}
          value={description}
          onChange={onChangeDescription}
          aria-label={t('spaces.appointments.input.description.label')}
          validationErrorText={descriptionError}
          testID="appointment-description"
          isRequired
          showCharacterCount
          noOfVisibleLines={4}
          maxNoOfVisibleLines={8}
          maxNoOfCharacters={600}
        />
        <View style={[styles.thumbnailContainer, styles.marginSeparator]}>
          {/* TODO: replace with HoliImage component. Image preview currently only working with ReactNativeImage */}
          {thumbnail?.uri ? (
            <ReactNativeImage
              source={{ uri: thumbnail?.uri ?? '' }}
              aria-label={t('spaces.appointments.input.thumbnail.label')}
              style={styles.thumbnail}
            />
          ) : currentThumbnail ? (
            <ReactNativeImage
              source={{ uri: currentThumbnail }}
              aria-label={t('spaces.appointments.input.thumbnail.label')}
              style={styles.thumbnail}
            />
          ) : (
            <View style={[styles.thumbnail, styles.thumbnailSkeleton]}>
              <HoliIcon icon={LinkM} size={20} color={colors.brandColorB30} />
            </View>
          )}
          <View style={styles.uploadButtonContainer}>
            <HoliImagePicker
              maxFileSizeInMB={10}
              buttonProps={{
                label: thumbnail?.uri
                  ? t('spaces.appointments.input.coverImage.change.button.label')
                  : t('spaces.appointments.input.upload.button.label'),
                testID: 'space-upload-image-btn',
                style: styles.imageUploadButton,
              }}
              onPickImage={onChangeThumbnail}
            >
              <HoliText>
                {thumbnail?.uri
                  ? t('spaces.appointments.input.coverImage.change.button.label')
                  : t('spaces.appointments.input.upload.button.label')}
              </HoliText>
            </HoliImagePicker>

            {thumbnail?.uri && (
              <HoliButton
                label={t('spaces.appointments.input.coverImage.remove.button.label')}
                onPress={() => onChangeThumbnail(undefined)}
                testID="create-space-remove-image-btn"
                style={styles.imageUploadButton}
                inline
              >
                <HoliText numberOfLines={1}>{t('spaces.appointments.input.coverImage.remove.button.label')}</HoliText>
              </HoliButton>
            )}
          </View>
          <View style={styles.instructionsContainer}>
            <HoliText size="extrasmall" style={styles.instructions}>
              {t('spaces.input.coverImage.upload.hint')}
            </HoliText>
          </View>
        </View>
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 3 }]}>
        <HoliModalSelect
          options={permissionTypeOptions}
          title={t('spaces.appointments.input.permission.title')}
          onChange={onChangePermissionType}
          placeholder={t('spaces.appointments.input.permission.placeholder')}
          label={t('spaces.appointments.input.permission.label')}
          testID="appointment-permission-input"
          description={t('spaces.appointments.input.permission.description')}
          showOptionIcon
          isRequired
        />
      </View>
    </>
  )
}

export default AppointmentInputForm

const styles = StyleSheet.create({
  marginSeparator: {
    marginTop: 24,
  },
  sectionWrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.background30,
    paddingTop: 24,
    marginTop: 32,
  },
  thumbnailTitle: {
    marginTop: 56,
  },
  thumbnailContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.background10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  thumbnail: {
    aspectRatio: 1,
    width: '20%',
    borderRadius: 8,
    marginBottom: 16,
  },
  thumbnailSkeleton: {
    backgroundColor: colors.brandColorB10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonContainer: {
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadButton: {
    backgroundColor: colors.background10,
    borderWidth: 1,
  },
  instructionsContainer: {
    marginTop: 16,
    justifyContent: 'center',
  },
  instructions: {
    justifyContent: 'center',
    textAlign: 'center',
    color: colors.foreground20,
  },

  calendarButton: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background10,
    color: colors.foreground30,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.background30,
  },
  calendarButtonHovered: {
    borderColor: colors.foreground20,
  },
})
