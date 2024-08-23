import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image as ReactNativeImage, StyleSheet, View } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import AppointmentVideoCallLinkInput from '@holi/core/screens/appointments/components/AppointmentVideoCallLinkInput'
import { PermissionsType } from '@holi/core/screens/appointments/types'
import { LocationDetails } from '@holi/core/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Global, LinkM, Lock, Team } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliDateAndTimePicker from '@holi/ui/components/organisms/HoliDateAndTimePicker'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect, { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  startDate: Date
  endDate: Date
  inviteOnly?: HoliModalSelectOption
  permissionType?: HoliModalSelectOption
  regularity?: HoliModalSelectOption
  thumbnail?: HoliImageInfo | null // null is for choosing to remove an image from an appointment and keeping it without image
  thumbnailBlurhash?: string
  locationDetails?: LocationDetails
  selectedLocation?: GeolocationSuggestion
  url?: string
  additionalInfo?: string
  currentThumbnail?: string
  onChangeTitle: (value: string) => void
  onChangeDescription: (value: string) => void
  onChangeInviteOnly: (value: HoliModalSelectOption) => void
  onChangeStartDate: (value: Date) => void
  onChangeEndDate: (value: Date) => void
  onChangePermissionType: (value: HoliModalSelectOption) => void
  onChangeThumbnail: (value: HoliImageInfo | undefined | null) => void
  onChangeLocationDetails: (value: LocationDetails) => void
  onChangeSelectedLocation: (value?: GeolocationSuggestion) => void
  onChangeUrl: (value: string) => void
  onChangeAdditionalInfo: (value: string) => void
  fieldErrors?: TranslatedFieldErrors
  isAdmin?: boolean
}

const AppointmentInputForm: React.FC<AppointmentInputFormProps> = ({
  title,
  description,
  inviteOnly,
  startDate,
  endDate,
  permissionType,
  thumbnail,
  currentThumbnail,
  selectedLocation,
  url,
  additionalInfo,
  onChangeTitle,
  onChangeDescription,
  onChangeInviteOnly,
  onChangeStartDate,
  onChangeEndDate,
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

  const { show: showInviteOnly, hide: hideInviteOnly, visible: visibleInviteOnly } = useModalState()
  const { show: showPermissionType, hide: hidePermissionType, visible: visiblePermissionType } = useModalState()

  const { t } = useTranslation()

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme

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
        maxNoOfCharacters={128}
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
          show={showInviteOnly}
          hide={hideInviteOnly}
          visible={visibleInviteOnly}
        />
      )}

      <View style={styles.sectionWrapper}>
        <HoliDateAndTimePicker
          title={t('spaces.appointments.input.startDate.title')}
          label={t('spaces.appointments.input.startDate.title')}
          value={startDate}
          onChange={(newStartDate) => {
            if (endDate && newStartDate > endDate) {
              onChangeEndDate(newStartDate)
            }
            onChangeStartDate(newStartDate)
          }}
          maximumDate={endDate}
        />

        <HoliDateAndTimePicker
          title={t('spaces.appointments.input.endDate.title')}
          label={t('spaces.appointments.input.endDate.title')}
          value={endDate}
          onChange={(newEndDate) => {
            if (startDate && newEndDate < startDate) {
              onChangeStartDate(newEndDate)
            }
            onChangeEndDate(newEndDate)
          }}
          minimumDate={startDate}
          style={styles.marginSeparator}
        />
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 3 }]}>
        <PlacesAutocomplete
          label={t('spaces.input.location.label')}
          placeholder={t('spaces.input.location.placeholder')}
          selected={selectedLocation}
          id="appointment-location"
          testID="appointment-location"
          onChange={onChangeSelectedLocation}
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
          testID="appointment-description"
          showCharacterCount
          noOfVisibleLines={4}
          maxNoOfVisibleLines={8}
          maxNoOfCharacters={5000}
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
              fileSizeLimitation={{
                type: 'resize',
                limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
                resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
              }}
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
          show={showPermissionType}
          hide={hidePermissionType}
          visible={visiblePermissionType}
        />
      </View>
    </>
  )
}

export default AppointmentInputForm

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    marginSeparator: {
      marginTop: 24,
    },
    sectionWrapper: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
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
      backgroundColor: theme.colors.background10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    thumbnail: {
      aspectRatio: 1,
      width: '20%',
      borderRadius: 8,
      marginBottom: 16,
    },
    thumbnailSkeleton: {
      backgroundColor: theme.colors.brandColorB10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadButtonContainer: {
      gap: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageUploadButton: {
      backgroundColor: theme.colors.background10,
      borderWidth: 1,
    },
    instructionsContainer: {
      marginTop: 16,
      justifyContent: 'center',
    },
    instructions: {
      justifyContent: 'center',
      textAlign: 'center',
      color: theme.colors.foreground20,
    },

    calendarButton: {
      paddingVertical: 16,
      paddingHorizontal: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.background10,
      color: theme.colors.foreground30,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.colors.background30,
    },
    calendarButtonHovered: {
      borderColor: theme.colors.foreground20,
    },
  })
