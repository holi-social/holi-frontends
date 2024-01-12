import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Image as ReactNativeImage } from 'react-native'

import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import AppointmentVideoCallLinkInput from '@holi/core/screens/appointments/components/AppointmentVideoCallLinkInput'
import { PermissionsType } from '@holi/core/screens/appointments/types'
import { GeolocationPoint } from '@holi/core/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Global, LinkM, Lock, Team } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliDateAndTimePicker from '@holi/ui/components/organisms/HoliDateAndTimePicker'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect, { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { numberToStringWithPad } from '@holi/ui/helper/date'
import { colors } from '@holi/ui/styles/globalVars'

// this enum is only used for the HoliModalSelect, since inviteOnly is a boolean value
export enum INVITE_ONLY_TYPE {
  INVITE_ONLY = 'INVITE_ONLY',
  PUBLIC = 'PUBLIC',
}

export const INVITE_ONLY_OPTIONS: HoliModalSelectOption[] = [
  {
    id: INVITE_ONLY_TYPE.PUBLIC,
    selected: true,
    icon: Global,
    title: INVITE_ONLY_TYPE.PUBLIC,
  },
  {
    id: INVITE_ONLY_TYPE.INVITE_ONLY,
    selected: false,
    icon: Lock,
    title: INVITE_ONLY_TYPE.INVITE_ONLY,
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
  startHours?: string
  endHours?: string
  startMinutes?: string
  endMinutes?: string
  permissionType?: HoliModalSelectOption
  regularity?: HoliModalSelectOption
  thumbnail?: HoliImageInfo | null // null is for choosing to remove an image from an appointment and keeping it without image
  thumbnailBlurhash?: string
  geolocation?: GeolocationPoint
  selectedLocation?: GeolocationSuggestion
  url?: string
  additionalInfo?: string
  currentThumbnail?: string
  currentLocation?: string
  onChangeTitle: (_: string) => void
  onChangeDescription: (_: string) => void
  onChangeInviteOnly: (_: HoliModalSelectOption) => void
  onChangeStartDate: (_: string) => void
  onChangeEndDate: (_: string) => void
  onChangeStartHours: (_: string) => void
  onChangeEndHours: (_: string) => void
  onChangeStartMinutes: (_: string) => void
  onChangeEndMinutes: (_: string) => void
  onChangePermissionType: (_: HoliModalSelectOption) => void
  onChangeThumbnail: (_: HoliImageInfo | undefined | null) => void
  onChangeGeolocation: (_: GeolocationPoint) => void
  onChangeSelectedLocation: (_: GeolocationSuggestion) => void
  onChangeUrl: (_: string) => void
  onChangeAdditionalInfo: (_: string) => void
  fieldErrors?: TranslatedFieldErrors
  isAdmin?: boolean
}

const AppointmentInputForm: React.VFC<AppointmentInputFormProps> = ({
  title,
  description,
  inviteOnly,
  startDate,
  endDate,
  startHours,
  endHours,
  startMinutes,
  endMinutes,
  permissionType,
  thumbnail,
  currentThumbnail,
  currentLocation,
  selectedLocation,
  url,
  additionalInfo,
  onChangeTitle,
  onChangeDescription,
  onChangeInviteOnly,
  onChangeStartDate,
  onChangeEndDate,
  onChangeStartHours,
  onChangeEndHours,
  onChangeStartMinutes,
  onChangeEndMinutes,
  onChangePermissionType,
  onChangeThumbnail,
  onChangeSelectedLocation,
  onChangeUrl,
  onChangeAdditionalInfo,
  fieldErrors = {},
  isAdmin,
}: AppointmentInputFormProps) => {
  const [optionsReady, setOptionsReady] = useState(false)
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
        disabled: !isAdmin && option.id === INVITE_ONLY_TYPE.PUBLIC,
        selected: inviteOnly?.id === option.id,
      }))
    )

    setPermissionTypeOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`spaces.appointments.input.permission.${option.id}.title`),
        description: t(`spaces.appointments.input.permission.${option.id}.description`),
        disabled: option.id === PermissionsType.PARTICIPANTS && inviteOnly?.id === INVITE_ONLY_TYPE.PUBLIC,
        selected: permissionType?.id === option.id,
      }))
    )
    setOptionsReady(true)
  }, [t, setInviteOnlyOptions, setPermissionTypeOptions, isAdmin, inviteOnly, permissionType, setOptionsReady])

  useEffect(() => {
    // for admins, set it as public initially
    if (optionsReady && !inviteOnly && isAdmin) {
      const publicAppointment = inviteOnlyOptions.find((option) => option.id === INVITE_ONLY_TYPE.PUBLIC)
      if (publicAppointment) {
        onChangeInviteOnly(publicAppointment)
      }
    }

    // for non-admins, set it as private by default
    if (optionsReady && !inviteOnly && !isAdmin) {
      const privateAppointment = inviteOnlyOptions.find((option) => option.id === INVITE_ONLY_TYPE.INVITE_ONLY)
      if (privateAppointment) {
        onChangeInviteOnly(privateAppointment)
      }
    }

    // whenever selected to public events, set permissions as admins only by default
    if (optionsReady && inviteOnly?.id === INVITE_ONLY_TYPE.PUBLIC && permissionType?.id !== PermissionsType.ADMINS) {
      const adminOnlyPermissions = permissionTypeOptions.find((option) => option.id === PermissionsType.ADMINS)
      if (adminOnlyPermissions) {
        onChangePermissionType(adminOnlyPermissions)
      }
    }

    // set permissions as admins only by default if not yet set
    if (optionsReady && !permissionType) {
      const adminOnlyPermissions = permissionTypeOptions.find((option) => option.id === PermissionsType.ADMINS)
      if (adminOnlyPermissions) {
        onChangePermissionType(adminOnlyPermissions)
      }
    }
  }, [
    inviteOnly,
    permissionType,
    isAdmin,
    inviteOnlyOptions,
    permissionTypeOptions,
    onChangeInviteOnly,
    onChangePermissionType,
    optionsReady,
  ])

  useEffect(() => {
    setTitleError(fieldErrors?.title?.length ? fieldErrors.title[0] : undefined)
    setDescriptionError(fieldErrors?.description?.length ? fieldErrors.description[0] : undefined)
  }, [fieldErrors, t])

  useEffect(() => {
    if (inviteOnly) {
      setInviteOnlyOptions((options) =>
        options.map((inviteOnlyOption) =>
          inviteOnlyOption.title === inviteOnly.title
            ? { ...inviteOnlyOption, selected: true }
            : { ...inviteOnlyOption, selected: false }
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

      {optionsReady && (
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
      )}

      <View style={styles.sectionWrapper}>
        <HoliDateAndTimePicker
          title={t('spaces.appointments.input.startDate.title')}
          label={t('spaces.appointments.input.startDate.title')}
          onChangeDate={(newStartDate) => {
            if (endDate && newStartDate > endDate) {
              onChangeEndDate(newStartDate)
            }
            onChangeStartDate(newStartDate)
          }}
          valueDate={startDate}
          valueHours={startHours}
          valueMinutes={startMinutes}
          onChangeHours={(newStartHours) => {
            if (`${endHours || '00'}:${endMinutes || '00'}` < `${newStartHours || '00'}:${startMinutes} || '00'`) {
              onChangeEndHours(numberToStringWithPad(+newStartHours))
            }
            onChangeStartHours(newStartHours)
          }}
          onChangeMinutes={(newStartMinutes) => {
            if (`${endHours || '00'}:${endMinutes || '00'}` < `${startHours || '00'}:${newStartMinutes || '00'}`) {
              onChangeEndMinutes(numberToStringWithPad(+newStartMinutes))
            }
            onChangeStartMinutes(newStartMinutes)
          }}
        />

        <HoliDateAndTimePicker
          title={t('spaces.appointments.input.endDate.title')}
          label={t('spaces.appointments.input.endDate.title')}
          onChangeDate={(newEndDate) => {
            if (startDate && newEndDate < startDate) {
              onChangeStartDate(newEndDate)
            }
            onChangeEndDate(newEndDate)
          }}
          valueDate={endDate}
          valueHours={endHours}
          valueMinutes={endMinutes}
          onChangeHours={(newEndHours) => {
            if (`${newEndHours || '00'}:${endMinutes || '00'}` < `${startHours || '00'}:${startMinutes || '00'}`) {
              onChangeStartHours(numberToStringWithPad(+newEndHours))
            }
            onChangeEndHours(newEndHours)
          }}
          onChangeMinutes={(newEndMinutes) => {
            if (`${endHours || '00'}:${newEndMinutes || '00'}` < `${startHours || '00'}:${startMinutes || '00'}`) {
              onChangeStartMinutes(numberToStringWithPad(+newEndMinutes))
            }
            onChangeEndMinutes(newEndMinutes)
          }}
          style={styles.marginSeparator}
        />
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 3 }]}>
        <PlacesAutocomplete
          label={t('spaces.input.location.label')}
          placeholder={t('spaces.input.location.placeholder')}
          selected={selectedLocation}
          value={selectedLocation?.label || currentLocation}
          id="appointment-location"
          testID="appointment-location"
          onChange={onChangeSelectedLocation}
          onSubmit={onChangeSelectedLocation}
          style={{ zIndex: 1 }}
        />

        <AppointmentVideoCallLinkInput
          url={url}
          additionalInfo={additionalInfo}
          onChangeAdditionalInfo={onChangeAdditionalInfo}
          onChangeUrl={onChangeUrl}
          style={styles.videoCallItem}
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

            {(!!thumbnail?.uri || currentThumbnail) && (
              <HoliButton
                label={t('spaces.appointments.input.coverImage.remove.button.label')}
                onPress={() => onChangeThumbnail(null)}
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
  videoCallItem: {
    marginTop: 12,
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
