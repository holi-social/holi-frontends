import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useErrorHandling } from '@holi/core/errors/hooks'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceFormScreenLayout from '@holi/core/screens/spaces/components/SpaceFormScreenLayout'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { GeolocationPoint } from '@holi/core/types'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import type { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { LocationType, useCreateTaskMutation, type VisibilityType } from '@holi/api/graphql/graphql-codegen'

import { CreateTaskSchema } from './taskSchema'
import TaskInputForm from './components/TaskInputForm'
import { useTiming } from './components/TaskInputForm/sections/TimingSection/useTiming'
import { useTimeFrame } from './components/TaskInputForm/sections/TimeFrameSection/useTimeFrame'

export type CreateTaskParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<CreateTaskParams>()

const DEFAULT_SLOTS_AVAILABLE = 1

const CreateTask = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { navigateBack } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const { openToast } = useToast()

  // input fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<HoliModalSelectOption | undefined>()
  const [locationType, setLocationType] = useState<HoliModalSelectOption | undefined>()
  const [contactEmail, setContactEmail] = useState('')
  const [slotsAvailable, setSlotsAvailable] = useState(DEFAULT_SLOTS_AVAILABLE)
  const [thumbnail, setThumbnail] = useState<HoliImageInfo | undefined>()
  const [skills, setSkills] = useState<string[]>([])
  const [location, setLocation] = useState<string | undefined>('')
  const [geolocation, setGeolocation] = useState<GeolocationPoint | undefined>()
  const [contactPhone, setContactPhone] = useState<string | undefined>('')

  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>()

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [inputValid, setInputValid] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  const timingSectionProps = useTiming()
  const timeFrameSectionProps = useTimeFrame()

  const { loading: loadingSpace, error: errorSpace, space } = useSpace(spaceIdOrName)

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const { displayError } = useErrorHandling()

  const [createTask] = useCreateTaskMutation({
    onCompleted: () => navigateBack(),
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        displayError(error, 'Failed to create task', {
          location: 'CreateTask.createTask',
          spaceIdOrName,
        })
      }
    },
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: spaceIdOrName } }],
  })

  const onSave = async () => {
    if (
      !space?.id ||
      !visibility?.id ||
      !locationType?.id ||
      !timingSectionProps.regularity ||
      !timingSectionProps.duration
    ) {
      return
    }

    return createTask({
      variables: {
        input: {
          spaceId: space.id,
          name,
          description,
          visibility: visibility?.id as VisibilityType,
          locationType: locationType?.id as LocationType,
          regularity: timingSectionProps.regularity,
          duration: timingSectionProps.duration,
          timeframeStartDate: timeFrameSectionProps.timeFrame.anytime
            ? undefined
            : timeFrameSectionProps.timeFrame.start.toISOString().split('T')[0],
          timeframeEndDate: timeFrameSectionProps.timeFrame.anytime
            ? undefined
            : timeFrameSectionProps.timeFrame.end.toISOString().split('T')[0],
          contactEmail,
          slotsAvailable,
          thumbnail: thumbnail?.blob,
          skillsV2: skills,
          location,
          geolocation,
          contactPhone,
        },
      },
    })
  }

  // If locationType is REMOTE, remove location and coordinates
  // Otherwise set their values based on the selectedLocation
  useEffect(() => {
    if (locationType?.id !== LocationType.Remote) {
      setGeolocation(
        selectedLocation?.coordinates
          ? {
              latitude: selectedLocation.coordinates.latitude,
              longitude: selectedLocation.coordinates.longitude,
            }
          : undefined
      )
      setLocation(selectedLocation?.label)
    }
    if (locationType?.id === LocationType.Remote) {
      setGeolocation(undefined)
      setLocation(undefined)
    }
  }, [selectedLocation, locationType])

  useEffect(() => {
    const resultSchema = CreateTaskSchema.safeParse({
      spaceId: space?.id,
      visibility: visibility?.id,
      locationType: locationType?.id,
      duration: timingSectionProps.duration,
      regularity: timingSectionProps.regularity,
      timeframeStartDate: timeFrameSectionProps.timeFrame.anytime ? undefined : timeFrameSectionProps.timeFrame.start,
      timeframeEndDate: timeFrameSectionProps.timeFrame.anytime ? undefined : timeFrameSectionProps.timeFrame.end,
      slotsAvailable: slotsAvailable,
      skillsV2: skills,
      ...(name ? { name } : {}),
      ...(description ? { description } : {}),
      ...(contactEmail ? { contactEmail } : {}),
      ...(contactPhone ? { contactPhone } : {}),
    })
    setInputValid(resultSchema.success)

    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
    } else {
      setFieldErrors({})
    }
  }, [
    space?.id,
    name,
    description,
    visibility,
    locationType,
    contactEmail,
    slotsAvailable,
    thumbnail,
    skills,
    location,
    geolocation,
    contactPhone,
    timingSectionProps.duration,
    timingSectionProps.regularity,
    timeFrameSectionProps.timeFrame.anytime,
    timeFrameSectionProps.timeFrame.start,
    timeFrameSectionProps.timeFrame.end,
  ])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('spaces.tasks.add.title')}
        </HoliHeading>
      ),
      headerBackVisible: isMember ? false : true,
      headerTitleAlign: 'center',
      headerLeft: isMember ? () => <HeaderBackButton onPress={() => setShowConfirmationModal(true)} /> : undefined,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [t, setScreenOptions, isMember])

  useEffect(() => {
    if (
      name.length > 0 &&
      description.length > 0 &&
      !!visibility &&
      !!locationType &&
      !!contactEmail &&
      !!timingSectionProps.duration &&
      !!timingSectionProps.regularity &&
      inputValid
    )
      setSaveButtonDisabled(false)
  }, [
    name,
    description,
    visibility,
    locationType,
    contactEmail,
    inputValid,
    timingSectionProps.duration,
    timingSectionProps.regularity,
  ])

  // Error and loading states are handled the same way and just hide the component
  if (loadingSpace || errorSpace || !space) {
    return <></>
  }

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceConnectionType.MEMBER}
    >
      <SpaceFormScreenLayout
        saveButtonDisabled={saveButtonDisabled}
        toggleConfirmationModal={setShowConfirmationModal}
        onSave={onSave}
        showConfirmationModal={showConfirmationModal}
      >
        <TaskInputForm
          name={name}
          description={description}
          visibility={visibility}
          locationType={locationType}
          contactEmail={contactEmail}
          slotsAvailable={slotsAvailable}
          thumbnail={thumbnail}
          skills={skills}
          geolocation={geolocation}
          selectedLocation={selectedLocation}
          contactPhone={contactPhone}
          timingSectionProps={timingSectionProps}
          timeFrameSectionProps={timeFrameSectionProps}
          onChangeName={setName}
          onChangeDescription={setDescription}
          onChangeVisibility={setVisibility}
          onChangeLocationType={setLocationType}
          onChangeContactEmail={setContactEmail}
          onChangeSlotsAvailable={setSlotsAvailable}
          onChangeThumbnail={setThumbnail}
          onChangeSkills={setSkills}
          onChangeGeolocation={setGeolocation}
          onChangeContactPhone={setContactPhone}
          onChangeSelectedLocation={setSelectedLocation}
          fieldErrors={fieldErrors}
          isAdmin={isAdmin}
        />
      </SpaceFormScreenLayout>
    </PermissionsGuard>
  )
}

export default CreateTask
