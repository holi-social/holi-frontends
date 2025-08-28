import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { Image as ReactNativeImage } from 'react-native'

import type { CreateAppointmentInput, LocationDetailsInput, Space } from '@holi/api/graphql/graphql-codegen'
import { PermissionType, SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
import FormWrapper from '@holi/core/components/FormWrapper'
import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import PlacesAutocomplete, { type GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import AppointmentVideoCallLinkInput from '@holi/core/screens/appointments/components/AppointmentVideoCallLinkInput'
import { CreateAppointmentSchema } from '@holi/core/screens/appointments/mutations'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Global, LinkM, Lock, Team } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliDateAndTimePicker from '@holi/ui/components/organisms/HoliDateAndTimePicker'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import HoliModalSelect, { type HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { transformToUTC } from '@holi/ui/helper/date'
import { constants, dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'

// this enum is only used for the HoliModalSelect, since inviteOnly is a boolean value
export enum INVITE_ONLY_TYPE {
  INVITE_ONLY = 'INVITE_ONLY',
  PUBLIC = 'PUBLIC',
}

export const INVITE_ONLY_OPTIONS: HoliModalSelectOption<INVITE_ONLY_TYPE>[] = [
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

export const PERMISSION_TYPE_OPTIONS: HoliModalSelectOption<PermissionType>[] = [
  {
    id: PermissionType.Participants,
    title: 'Members',
    selected: true,
    icon: Team,
  },
  {
    id: PermissionType.Admins,
    title: 'Admins',
    selected: false,
    icon: Lock, // TODO: Add admin icon
  },
]

const roundToNextFullHour = (date: Date, add: number) => {
  date.setHours(date.getHours() + add)
  date.setMinutes(0, 0, 0)
  return date
}

export const getAppointmentDefaultInitialState = (
  override: Partial<CreateAppointmentInput> = {}
): CreateAppointmentInput => ({
  spaceId: '',
  title: '',
  description: '',
  locationDetails: undefined,
  inviteOnly: false,
  participantIds: [],
  permission: PermissionType.Admins,
  startDateTime: transformToUTC(roundToNextFullHour(new Date(), 1)),
  endDateTime: transformToUTC(roundToNextFullHour(new Date(), 2)),
  thumbnail: undefined,
  videoCallInfo: undefined,
  videoCallLink: undefined,
  ...override,
})

export interface AppointmentInputFormProps {
  space: Pick<Space, 'id' | 'connectionStatusToMyself' | 'name' | 'members'>
  initialAppointment: CreateAppointmentInput
  onSubmit: (appointment: CreateAppointmentInput) => Promise<void>
  onBackButtonPress?: () => void
}

const locationDetailsInputToGeolocationSuggestion = (locationDetails: LocationDetailsInput): GeolocationSuggestion => ({
  id: '1',
  label: locationDetails.completeAddress ?? '',
  city: locationDetails.city,
  state: locationDetails.state || undefined,
  country: locationDetails.country,
  ...(locationDetails.geolocation?.latitude && locationDetails.geolocation?.longitude
    ? {
        coordinates: {
          latitude: locationDetails.geolocation?.latitude,
          longitude: locationDetails.geolocation?.longitude,
        },
      }
    : {}),
})

const geolocationSuggestionToLocationDetails = (suggestion: GeolocationSuggestion): LocationDetailsInput => ({
  completeAddress: suggestion.label,
  city: suggestion.city,
  state: suggestion.state,
  country: suggestion.country,
  geolocation: suggestion.coordinates
    ? {
        latitude: suggestion.coordinates.latitude,
        longitude: suggestion.coordinates.longitude,
      }
    : undefined,
})

const AppointmentInputForm = ({
  space,
  initialAppointment,
  onSubmit,
  onBackButtonPress,
}: AppointmentInputFormProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme

  const [pristine, setPristine] = useState(true)
  const [appointment, setAppointment] = useState<CreateAppointmentInput>({
    ...initialAppointment,
    thumbnail: initialAppointment.thumbnail ? { uri: initialAppointment.thumbnail } : undefined,
  })
  const startDate = appointment.startDateTime ? new Date(appointment.startDateTime) : new Date()
  const endDate = appointment.endDateTime ? new Date(appointment.endDateTime) : new Date()
  const selectedLocation: GeolocationSuggestion | undefined =
    appointment.locationDetails && locationDetailsInputToGeolocationSuggestion(appointment.locationDetails)

  const onAppointmentChange = (update: Partial<CreateAppointmentInput>) => {
    setAppointment((prev) => ({ ...prev, ...update }))
    setPristine(false)
  }

  const { show: showInviteOnly, hide: hideInviteOnly, visible: visibleInviteOnly } = useModalState()
  const { show: showPermissionType, hide: hidePermissionType, visible: visiblePermissionType } = useModalState()

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)

  const inviteOnlyOptions = INVITE_ONLY_OPTIONS.map((option) => {
    const checkSelection = () => {
      switch (option.id) {
        case INVITE_ONLY_TYPE.PUBLIC: {
          if (!isAdmin) return false
          return !appointment.inviteOnly
        }
        case INVITE_ONLY_TYPE.INVITE_ONLY:
          if (!isAdmin) return true
          return appointment.inviteOnly
      }
    }

    return {
      ...option,
      title: t(`spaces.appointments.input.inviteOnly.${option.id}.title`),
      description: t(`spaces.appointments.input.inviteOnly.${option.id}.description`),
      disabled: !isAdmin && option.id === INVITE_ONLY_TYPE.PUBLIC,
      selected: checkSelection(),
    }
  })

  const permissionTypeOptions = PERMISSION_TYPE_OPTIONS.map((option) => ({
    ...option,
    title: t(`spaces.appointments.input.permission.${option.id}.title`),
    description: t(`spaces.appointments.input.permission.${option.id}.description`),
    disabled: option.id === PermissionType.Participants && !appointment.inviteOnly,
    selected: appointment.permission === option.id,
  }))

  const validation = CreateAppointmentSchema.safeParse({ ...appointment, spaceId: space?.id })
  const errors = pristine ? {} : validation.error?.flatten().fieldErrors

  const onSave = async () => {
    setPristine(false)
    if (validation.success) {
      await onSubmit({
        ...appointment,
        spaceId: space?.id,
        thumbnail: appointment.thumbnail?.blob,
        participantIds: appointment.inviteOnly ? space?.members.data.map(({ user }) => user.id) : [], // TODO: remove this logic when allowing choosing specific participants
        inviteOnly: !!appointment.inviteOnly,
      })
    }
  }

  return (
    <FormWrapper
      onSave={onSave}
      saveButtonDisabled={!validation.success}
      onBack={onBackButtonPress}
      showBackButton
      behavior="padding"
      scrollToInput={false}
      keyboardShouldPersistTaps="handled"
      bottomBarStyle={styles.bottomBar}
      initialOffsetTop={Platform.OS === 'ios' ? dimensions.bottomBarHeight : undefined}
      renderProp={() => (
        <View style={styles.container}>
          <HoliTextInput
            placeholder={t('spaces.appointments.input.title.placeholder')}
            inputLabel={t('spaces.appointments.input.title.label')}
            validationErrorText={errors?.title?.[0]}
            value={appointment.title}
            onChange={(title) => onAppointmentChange({ title })}
            aria-label={t('spaces.appointments.input.title.label')}
            testID="appointment-title"
            isRequired
            showCharacterCount
            maxNoOfCharacters={128}
            inputProps={{ autoFocus: true }}
          />

          <HoliModalSelect
            options={inviteOnlyOptions}
            title={t('spaces.appointments.input.inviteOnly.title')}
            onChange={(option) => onAppointmentChange({ inviteOnly: option.id === INVITE_ONLY_TYPE.INVITE_ONLY })}
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

          <View style={styles.sectionWrapper}>
            <HoliDateAndTimePicker
              title={t('spaces.appointments.input.startDate.title')}
              label={t('spaces.appointments.input.startDate.title')}
              value={startDate}
              onChange={(newStartDate) => {
                onAppointmentChange({
                  startDateTime: transformToUTC(newStartDate),
                  endDateTime: newStartDate > endDate ? transformToUTC(newStartDate) : appointment.endDateTime,
                })
              }}
              testID="appointment-start-date"
            />

            <HoliDateAndTimePicker
              title={t('spaces.appointments.input.endDate.title')}
              label={t('spaces.appointments.input.endDate.title')}
              value={endDate}
              onChange={(newEndDate) => {
                onAppointmentChange({
                  startDateTime: newEndDate < startDate ? transformToUTC(newEndDate) : appointment.startDateTime,
                  endDateTime: transformToUTC(newEndDate),
                })
              }}
              minimumDate={startDate}
              style={styles.marginSeparator}
              testID="appointment-end-date"
            />
          </View>

          <View style={[styles.sectionWrapper, { zIndex: 3 }]}>
            <PlacesAutocomplete
              label={t('spaces.input.location.label')}
              placeholder={t('spaces.input.location.placeholder')}
              selected={selectedLocation}
              id="appointment-location"
              testID="appointment-location"
              onChange={(geoLocationSuggestion) =>
                onAppointmentChange({
                  locationDetails:
                    geoLocationSuggestion && geolocationSuggestionToLocationDetails(geoLocationSuggestion),
                })
              }
              style={{ zIndex: 1 }}
            />

            <AppointmentVideoCallLinkInput
              url={appointment.videoCallLink}
              additionalInfo={appointment.videoCallInfo}
              onChangeAdditionalInfo={(videoCallInfo) => onAppointmentChange({ videoCallInfo })}
              onChangeUrl={(videoCallLink) => onAppointmentChange({ videoCallLink })}
              style={styles.videoCallItem}
            />
          </View>

          <View style={[styles.sectionWrapper, { zIndex: 1 }]}>
            <HoliTextInput
              placeholder={t('spaces.appointments.input.description.placeholder')}
              inputLabel={t('spaces.appointments.input.description.label')}
              value={appointment.description}
              onChange={(description) => onAppointmentChange({ description })}
              aria-label={t('spaces.appointments.input.description.label')}
              testID="appointment-description"
              showCharacterCount
              noOfVisibleLines={4}
              maxNoOfVisibleLines={8}
              maxNoOfCharacters={5000}
            />
            <View style={[styles.thumbnailContainer, styles.marginSeparator]}>
              {/* TODO: replace with HoliImage component. Image preview currently only working with ReactNativeImage */}
              {appointment.thumbnail?.uri ? (
                <ReactNativeImage
                  source={{ uri: appointment.thumbnail?.uri ?? '' }}
                  aria-label={t('spaces.appointments.input.thumbnail.label')}
                  style={styles.thumbnail}
                />
              ) : (
                <View style={[styles.thumbnail, styles.thumbnailSkeleton]}>
                  <HoliIcon icon={LinkM} size={20} colorOverride={colors.brandColorB30} />
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
                    label: appointment.thumbnail?.uri
                      ? t('spaces.appointments.input.coverImage.change.button.label')
                      : t('spaces.appointments.input.upload.button.label'),
                    testID: 'space-upload-image-btn',
                    variant: 'secondary',
                  }}
                  onPickImage={(thumbnail) => onAppointmentChange({ thumbnail })}
                />

                {!!appointment.thumbnail?.uri && (
                  <Button
                    label={t('spaces.appointments.input.coverImage.remove.button.label')}
                    onPress={() => onAppointmentChange({ thumbnail: undefined })}
                    testID="create-space-remove-image-btn"
                    inline
                    variant="secondary"
                  />
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
              onChange={(option) => onAppointmentChange({ permission: option.id })}
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
        </View>
      )}
    />
  )
}

export default AppointmentInputForm

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'web' ? dimensions.topBarHeight + (constants.statusBarHeight || 0) + 24 : 0,
      paddingBottom: dimensions.bottomBarHeight + 24,
    },
    bottomBar: {
      backgroundColor: theme.colors.background10,
    },
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
