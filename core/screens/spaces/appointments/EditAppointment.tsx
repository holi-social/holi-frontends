import { useMutation, useQuery } from '@apollo/client'
import Constants from 'expo-constants'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import FormWrapper from '@holi/core/components/FormWrapper'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useErrorHandling } from '@holi/core/errors/hooks'
import { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import AppointmentInputForm, {
  INVITE_ONLY_OPTIONS,
  INVITE_ONLY_TYPE,
  PERMISSION_TYPE_OPTIONS,
} from '@holi/core/screens/appointments/components/AppointmentInputForm'
import {
  UpdateAppointmentResponse,
  UpdateAppointmentSchema,
  updateAppointmentMutation,
} from '@holi/core/screens/appointments/mutations'
import { appointmentByIdOrSlugQuery, appointmentByIdOrSlugResponse } from '@holi/core/screens/appointments/queries'
import { PermissionsType as AppointmentPermissionsType } from '@holi/core/screens/appointments/types'
import { SpaceByIdResponse, spaceByIdWithAllMembersQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { LocationDetails } from '@holi/core/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { formatDateToYYYMMDD, numberToStringWithPad, transformToUTC } from '@holi/ui/helper/date'
import { colors } from '@holi/ui/styles/globalVars'
import dimensions from '@holi/ui/styles/globalVars/dimensions'

export type EditAppointmentParams = {
  spaceIdOrName: string
  idOrSlug: string
}

const { useParam } = createParamHooks<EditAppointmentParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const EditAppointment: React.FC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [idOrSlug] = useParam('idOrSlug')
  const { navigateBack, replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { ftEnabled, ftLoading } = useFeatureToggle(FeatureToggleName.APPOINTMENTS)
  const { t } = useTranslation()

  // input fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [inviteOnly, setInviteOnly] = useState<HoliModalSelectOption | undefined>()
  const [startDate, setStartDate] = useState<string>(formatDateToYYYMMDD(new Date()))
  const [endDate, setEndDate] = useState<string>(formatDateToYYYMMDD(new Date()))
  const [startHours, setStartHours] = useState<string>(numberToStringWithPad(new Date().getHours()))
  const [endHours, setEndHours] = useState<string>(numberToStringWithPad(new Date().getHours()))
  const [startMinutes, setStartMinutes] = useState<string>(numberToStringWithPad(new Date().getMinutes()))
  const [endMinutes, setEndMinutes] = useState<string>(numberToStringWithPad(new Date().getMinutes()))
  const [permissionType, setPermissionType] = useState<HoliModalSelectOption | undefined>()
  const [thumbnail, setThumbnail] = useState<HoliImageInfo | undefined | null>()
  const [locationDetails, setLocationDetails] = useState<LocationDetails | undefined>()
  const [url, setUrl] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [currentThumbnail, setCurrentThumbnail] = useState<string | undefined>()
  const [currentLocationDetails, setCurrentLocationDetails] = useState<LocationDetails | undefined>()

  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>()

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [inputValid, setInputValid] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')

  const {
    loading: loadingAppointment,
    error: errorAppointment,
    data: appointmentData,
    called: calledAppointment,
  } = useQuery<appointmentByIdOrSlugResponse>(appointmentByIdOrSlugQuery, {
    variables: { idOrSlug },
    onError: (error) =>
      !isNotFoundError(error) &&
      logError(error, 'Failed to load appointment', {
        location: 'EditAppointment.appointmentByIdOrSlugQuery',
        idOrSlug,
      }),
    skip: !idOrSlug,
  })

  const { data, loading: loadingSpace } = useQuery<SpaceByIdResponse>(spaceByIdWithAllMembersQuery, {
    variables: { idOrName: spaceIdOrName },
    skip: !spaceIdOrName,
    onError: (error) =>
      logError(error, 'Failed to load space', {
        location: 'EditAppointment.spaceByIdWithAllMembersQuery',
        spaceIdOrName,
      }),
  })

  const appointment = appointmentData?.appointment
  const space = data?.spaceById
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const { displayError } = useErrorHandling()

  const [updateAppointment] = useMutation<UpdateAppointmentResponse>(updateAppointmentMutation, {
    onCompleted: () => navigateBack(),
    onError: (error) =>
      displayError(error, 'Failed to create appointment', {
        location: 'EditAppointment.updateAppointment',
        spaceIdOrName,
      }),
    refetchQueries: ['Appointments'],
  })

  const onSave = () =>
    updateAppointment({
      variables: {
        input: {
          appointmentId: appointment?.id,
          title,
          description,
          inviteOnly: inviteOnly?.id === INVITE_ONLY_TYPE.INVITE_ONLY,
          participantIds:
            inviteOnly?.id === INVITE_ONLY_TYPE.INVITE_ONLY ? space?.members.data.map(({ user }) => user.id) : [], // TODO: remove this logic when allowing choosing specific participants
          permission: permissionType?.id,
          thumbnail: thumbnail === null ? null : thumbnail?.blob, // null is used to inform the backend that the thumbnail has been deleted
          startDateTime: transformToUTC(`${startDate}T${startHours}:${startMinutes}` || ''),
          endDateTime: transformToUTC(`${endDate}T${endHours}:${endMinutes}` || ''),
          locationDetails: locationDetails,
          videoCallLink: url,
          videoCallInfo: additionalInfo,
        },
      },
    })

  useEffect(() => {
    if (selectedLocation?.coordinates) {
      setLocationDetails({
        completeAddress: selectedLocation.label,
        city: selectedLocation.city,
        state: selectedLocation.state,
        country: selectedLocation.country,
        geolocation: {
          latitude: selectedLocation.coordinates.latitude,
          longitude: selectedLocation.coordinates.longitude,
        },
      })
    } else {
      setLocationDetails(undefined)
    }
  }, [selectedLocation, permissionType])

  useEffect(() => {
    const resultSchema = UpdateAppointmentSchema.safeParse({
      spaceId: space?.id,
      inviteOnly: inviteOnly?.id === INVITE_ONLY_TYPE.INVITE_ONLY,
      permission: permissionType?.id,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    })
    setInputValid(resultSchema.success)

    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
    } else {
      setFieldErrors({})
    }
  }, [space?.id, title, description, inviteOnly, permissionType, thumbnail, locationDetails])

  useLayoutEffect(() => {
    !loadingSpace &&
      isMember &&
      setScreenOptions({
        animation: 'slide_from_bottom',
        headerTitle: () => (
          <HoliHeading level="1" size="s">
            {t('spaces.appointments.edit.button.label')}
          </HoliHeading>
        ),
        headerStyle: { backgroundColor: colors.background10 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
  }, [t, loadingSpace, isMember, setScreenOptions])

  useEffect(() => {
    if (title.length > 0 && description.length > 0 && inputValid) {
      setSaveButtonDisabled(false)
    }
  }, [title, description, inviteOnly, permissionType, inputValid])

  useEffect(() => {
    if (appointment) {
      // first handle the select options values to pick the correct options
      const inviteOnlyOption = INVITE_ONLY_OPTIONS.find((option) =>
        appointment.inviteOnly ? option.id === INVITE_ONLY_TYPE.INVITE_ONLY : option.id === INVITE_ONLY_TYPE.PUBLIC
      )
      if (inviteOnlyOption && appointment.inviteOnly) {
        setInviteOnly({
          title: t(`spaces.appointments.input.inviteOnly.${inviteOnlyOption.id}.title`),
          description: t(`spaces.appointments.input.inviteOnly.${inviteOnlyOption.id}.description`),
          disabled: !isAdmin && inviteOnlyOption.id === INVITE_ONLY_TYPE.PUBLIC,
          selected: inviteOnly?.id === inviteOnlyOption.id,
        } as HoliModalSelectOption)
      }
      const permissionTypeOption = PERMISSION_TYPE_OPTIONS.find((option) =>
        appointment.inviteOnly ? option.id === INVITE_ONLY_TYPE.INVITE_ONLY : option.id === INVITE_ONLY_TYPE.PUBLIC
      )
      if (permissionTypeOption && appointment.permission) {
        setPermissionType({
          title: t(`spaces.appointments.input.permission.${permissionTypeOption.id}.title`),
          description: t(`spaces.appointments.input.permission.${permissionTypeOption.id}.description`),
          disabled:
            permissionTypeOption.id === AppointmentPermissionsType.PARTICIPANTS &&
            inviteOnly?.id === INVITE_ONLY_TYPE.PUBLIC,
          selected: permissionType?.id === permissionTypeOption.id,
        } as HoliModalSelectOption)
      }

      if (appointment.locationDetails) {
        const { city, completeAddress, country, geolocation, state } = appointment.locationDetails

        const _location = {
          completeAddress: completeAddress,
          city: city,
          state: state,
          country: country,
          geolocation: {
            latitude: geolocation?.latitude,
            longitude: geolocation?.longitude,
          },
        }

        setLocationDetails(_location)
        setCurrentLocationDetails(_location)
      }

      const start = new Date(appointment.startDateTime)
      const end = new Date(appointment.endDateTime)

      // set all other fields accordingly
      setTitle(appointment.title)
      setDescription(appointment.description)
      setStartDate(formatDateToYYYMMDD(start))
      setEndDate(formatDateToYYYMMDD(end))
      setStartHours(numberToStringWithPad(start.getHours()))
      setStartMinutes(numberToStringWithPad(start.getMinutes()))
      setEndHours(numberToStringWithPad(end.getHours()))
      setEndMinutes(numberToStringWithPad(end.getMinutes()))
      setCurrentThumbnail(appointment.thumbnail)
      setUrl(appointment.videoCallLink?.url || '')
      setAdditionalInfo(appointment.videoCallLink?.additionalInfo || '')
    }
  }, [appointment, inviteOnly?.id, isAdmin, permissionType?.id, t])

  useEffect(() => {
    // if a thumbnail is uploaded or the current one is deleted, update the currentThumbnail
    if (thumbnail || thumbnail === null) {
      setCurrentThumbnail(undefined)
    }
  }, [thumbnail, setCurrentThumbnail])

  if (loadingSpace || ftLoading || loadingAppointment) {
    return <HoliLoader />
  }

  if (
    (errorAppointment && isNotFoundError(errorAppointment)) ||
    (calledAppointment && !loadingAppointment && !appointment)
  ) {
    replaceRoute('/404')
    return <></>
  }

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceConnectionType.MEMBER}
      forceRestrict={!ftEnabled && !ftLoading}
      redirectRoute={`/spaces/${spaceIdOrName}`}
    >
      <FormWrapper
        onSave={onSave}
        saveButtonDisabled={saveButtonDisabled}
        onBack={() => setShowConfirmationModal(true)}
        showBackButton
        behavior="padding"
        scrollToInput={false}
        bottomBarStyle={styles.bottomBar}
        renderProp={() => (
          <AppointmentInputForm
            title={title}
            description={description}
            inviteOnly={inviteOnly}
            startDate={startDate}
            endDate={endDate}
            startHours={startHours}
            endHours={endHours}
            startMinutes={startMinutes}
            endMinutes={endMinutes}
            permissionType={permissionType}
            thumbnail={thumbnail}
            locationDetails={locationDetails}
            selectedLocation={selectedLocation}
            url={url}
            additionalInfo={additionalInfo}
            currentThumbnail={currentThumbnail}
            currentLocationDetails={currentLocationDetails}
            onChangeTitle={setTitle}
            onChangeDescription={setDescription}
            onChangeInviteOnly={setInviteOnly}
            onChangePermissionType={setPermissionType}
            onChangeThumbnail={setThumbnail}
            onChangeLocationDetails={setLocationDetails}
            onChangeSelectedLocation={setSelectedLocation}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
            onChangeStartHours={setStartHours}
            onChangeEndHours={setEndHours}
            onChangeStartMinutes={setStartMinutes}
            onChangeEndMinutes={setEndMinutes}
            onChangeUrl={setUrl}
            onChangeAdditionalInfo={setAdditionalInfo}
            fieldErrors={fieldErrors}
            isAdmin={isAdmin}
          />
        )}
      />
      <HoliConfirmation
        show={showConfirmationModal}
        label={exitConfirmationTitle}
        title={exitConfirmationTitle}
        description={t('global.leavePage.confirmation.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('global.leavePage.confirmation.dismiss')}
        confirmText={t('global.leavePage.confirmation.confirm')}
        testID="form-modal-exit-confirmation"
        onConfirm={() => {
          setShowConfirmationModal(false)
          navigateBack()
        }}
      />
    </PermissionsGuard>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: +dimensions.topBarHeight + (Constants.statusBarHeight || 0) + 24,
    paddingBottom: +dimensions.bottomBarHeight + 24,
  },
  bottomBar: {
    backgroundColor: colors.background10,
  },
})

export default EditAppointment
