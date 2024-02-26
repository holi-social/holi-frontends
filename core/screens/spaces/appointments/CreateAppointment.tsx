import { useMutation, useQuery } from '@apollo/client'
import Constants from 'expo-constants'
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import FormWrapper from '@holi/core/components/FormWrapper'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { logError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useErrorHandling } from '@holi/core/errors/hooks'
import { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import AppointmentInputForm, { INVITE_ONLY_TYPE } from '@holi/core/screens/appointments/components/AppointmentInputForm'
import {
  CreateAppointmentResponse,
  CreateAppointmentSchema,
  createAppointmentMutation,
} from '@holi/core/screens/appointments/mutations'
import { APPOINTMENT_STATUS_TYPE, appointmentsBySpaceIdQuery } from '@holi/core/screens/appointments/queries'
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
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type CreateAppointmentParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<CreateAppointmentParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const CreateAppointment: React.FC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { navigateBack } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { ftEnabled, ftLoading } = useFeatureToggle(FeatureToggleName.APPOINTMENTS)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

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

  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>()

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [inputValid, setInputValid] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')

  const {
    data,
    error: errorSpace,
    loading: loadingSpace,
  } = useQuery<SpaceByIdResponse>(spaceByIdWithAllMembersQuery, {
    variables: { idOrName: spaceIdOrName },
    skip: !spaceIdOrName,
    onError: (error) =>
      logError(error, 'Failed to load space', {
        location: 'CreateAppointment.spaceByIdWithAllMembersQuery',
        spaceIdOrName,
      }),
  })

  const space = data?.spaceById
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const { displayError } = useErrorHandling()

  const [createAppointment] = useMutation<CreateAppointmentResponse>(createAppointmentMutation, {
    onCompleted: () => navigateBack(),
    onError: (error) =>
      displayError(error, 'Failed to create appointment', {
        location: 'CreateAppointment.createAppointment',
        spaceIdOrName,
      }),
    refetchQueries: [
      {
        query: appointmentsBySpaceIdQuery,
        variables: { spaceId: space?.id, statusType: APPOINTMENT_STATUS_TYPE.UPCOMING },
      },
    ],
  })

  const onSave = () =>
    createAppointment({
      variables: {
        input: {
          spaceId: space?.id,
          title,
          description,
          inviteOnly: inviteOnly?.id === INVITE_ONLY_TYPE.INVITE_ONLY,
          participantIds:
            inviteOnly?.id === INVITE_ONLY_TYPE.INVITE_ONLY ? space?.members.data.map(({ user }) => user.id) : [], // TODO: remove this logic when allowing choosing specific participants
          permission: permissionType?.id,
          thumbnail: thumbnail?.blob,
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
    const resultSchema = CreateAppointmentSchema.safeParse({
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
            {t('spaces.appointments.add.button.label')}
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
    setSaveButtonDisabled(!title.length || !inputValid)
  }, [title, inputValid])

  if (loadingSpace || ftLoading) {
    return <HoliLoader />
  }

  // Error and loading states are handled the same way and just hide the component
  if (errorSpace || !space) {
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
        keyboardShouldPersistTaps="handled"
        bottomBarStyle={styles.bottomBar}
        initialOffsetTop={Platform.OS === 'ios' ? +dimensions.bottomBarHeight : undefined}
        renderProp={() => (
          <View style={styles.container}>
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
          </View>
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: +dimensions.topBarHeight + (Constants.statusBarHeight || 0) + 24,
      paddingBottom: +dimensions.bottomBarHeight + 24,
    },
    bottomBar: {
      backgroundColor: theme.colors.background10,
    },
  })

export default CreateAppointment
