import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
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
import TaskInputForm from '@holi/core/screens/spaces/tasks/components/TaskInputForm'
import {
  updateTaskMutation,
  type UpdateTaskResponse,
  UpdateTaskSchema,
} from '@holi/core/screens/spaces/tasks/mutations'
import { LocationType, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { GeolocationPoint } from '@holi/core/types'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import type { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'

// TODO TASK TIMING: uncomment the useTimeFrame hook after implementing the Task Timing feature in the BE
// import { useTimeFrame } from './components/TaskInputForm/sections/TimeFrameSection/useTimeFrame'

export type EditTaskParams = {
  spaceIdOrName: string
  taskId: string
}

const { useParam, useUUIDParam } = createParamHooks<EditTaskParams>()

const DEFAULT_SLOTS_AVAILABLE = 1

const EditTask = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { navigateBack, replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const [taskId] = useUUIDParam('taskId')
  const { openToast } = useToast()

  // input fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<HoliModalSelectOption | undefined>()
  const [locationType, setLocationType] = useState<HoliModalSelectOption | undefined>()
  const [regularity, setRegularity] = useState<HoliModalSelectOption | undefined>()
  const [contactEmail, setContactEmail] = useState('')
  const [slotsAvailable, setSlotsAvailable] = useState(DEFAULT_SLOTS_AVAILABLE)
  const [thumbnail, setThumbnail] = useState<HoliImageInfo | undefined>()
  const [thumbnailBlurhash, setThumbnailBlurhash] = useState<string | undefined>()
  const [currentThumbnail, setCurrentThumbnail] = useState<string | undefined>()
  const [skills, setSkills] = useState<string[]>([])
  const [location, setLocation] = useState<string | undefined>('')
  const [geolocation, setGeolocation] = useState<GeolocationPoint | undefined>()
  const [contactPhone, setContactPhone] = useState<string | undefined>('')

  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>()

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false)
  const [inputValid, setInputValid] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  // TODO TASK TIMING: uncomment the useTimeFrame hook after implementing the Task Timing feature in the BE
  // const timeFrameSectionProps = useTimeFrame()

  const { loading: loadingSpace, error: errorSpace, space } = useSpace(spaceIdOrName)

  const loginState = useLoggedInUser()
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const task = (space?.tasks || []).find((t) => t.id === taskId)
  const isTaskOwner = loginState.isLoggedIn && task?.creator.id === loginState.user.id

  const { displayError } = useErrorHandling()

  const [updateTask] = useMutation<UpdateTaskResponse>(updateTaskMutation, {
    onCompleted: () => navigateBack(),
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        displayError(error, 'Failed to update task', {
          location: 'EditTask.updateTask',
          spaceIdOrName,
        })
      }
    },
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: spaceIdOrName } }],
  })

  const onSave = () =>
    updateTask({
      variables: {
        input: {
          taskId: task?.id,
          spaceId: space?.id,
          name,
          description,
          visibility: visibility?.id,
          locationType: locationType?.id,
          regularity: regularity?.id,
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

  // If locationType is REMOTE, remove location and coordinates
  // Otherwise set their values based on the selectedLocation
  useEffect(() => {
    if (locationType?.id !== LocationType.REMOTE) {
      setGeolocation(
        selectedLocation?.coordinates
          ? {
              latitude: selectedLocation.coordinates.latitude,
              longitude: selectedLocation.coordinates.longitude,
            }
          : undefined
      )
      setLocation(selectedLocation?.label || '')
    }
    if (locationType?.id === LocationType.REMOTE) {
      setGeolocation(undefined)
      setLocation(undefined)
    }
  }, [selectedLocation, locationType])

  useEffect(() => {
    const resultSchema = UpdateTaskSchema.safeParse({
      taskId: task?.id,
      spaceId: space?.id,
      visibility: visibility?.id,
      locationType: locationType?.id,
      regularity: regularity?.id,
      skillsV2: skills,
      name,
      description,
      contactEmail,
      contactPhone,
      slotsAvailable,
    })
    setInputValid(resultSchema.success)

    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
    } else {
      setFieldErrors({})
    }
  }, [
    task?.id,
    space?.id,
    name,
    description,
    visibility,
    locationType,
    regularity,
    contactEmail,
    slotsAvailable,
    thumbnail,
    skills,
    location,
    geolocation,
    contactPhone,
  ])

  useEffect(() => {
    if (task) {
      setName(task.name)
      setDescription(task.description)
      setVisibility({
        id: task.visibility,
        title: t(`spaces.input.task.visibility.${task.visibility}.title`),
        description: t(`spaces.input.task.visibility.${task.visibility}.description`),
      })
      setLocationType({
        id: task.locationType,
        title: t(`spaces.input.task.locationType.${task.locationType}.title`),
        description: t(`spaces.input.task.locationType.${task.locationType}.description`),
      })
      setRegularity({
        id: task.regularity,
        title: t(`spaces.input.task.regularity.${task.regularity}.title`),
        description: t(`spaces.input.task.regularity.${task.regularity}.description`),
      })
      setContactEmail(task.contactEmail)
      setSlotsAvailable(task.slotsAvailable)
      setCurrentThumbnail(task.thumbnail)
      setThumbnailBlurhash(task.thumbnailBlurhash)
      setSkills(task.skillsV2)
      setLocation(task.location)
      setGeolocation(task.geolocation)
      setContactPhone(task.contactPhone)
      setSelectedLocation(task.location ? { label: task.location, id: '', coordinates: task.geolocation } : undefined)
      // TODO TASK TIMING: set the Time Frame data for the task after implementing the Task Timing feature in the BE
      // if (task.timeFrame.anytime) {
      //   timeFrameSectionProps.setAnytime(true)
      // } else {
      //   timeFrameSectionProps.setAnytime(false)
      //   timeFrameSectionProps.setStart(task.timeFrame.start)
      //   timeFrameSectionProps.setEnd(task.timeFrame.end)
      // }
    }
  }, [space, task, t])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('spaces.tasks.edit.title')}
        </HoliHeading>
      ),
      headerTitleAlign: 'center',
      headerBackVisible: isMember ? false : true,
      headerLeft: isMember ? () => <HeaderBackButton onPress={() => setShowConfirmationModal(true)} /> : undefined,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [t, isMember, setScreenOptions])

  useEffect(() => {
    if (
      name.length > 0 &&
      description.length > 0 &&
      !!visibility &&
      !!locationType &&
      !!regularity &&
      !!contactEmail &&
      inputValid
    ) {
      setSaveButtonDisabled(false)
    }
  }, [name, description, visibility, locationType, regularity, contactEmail, inputValid])

  if (space && !task) {
    replaceRoute('/404')
    return <></>
  }

  // Error and loading states are handled the same way and just hide the component
  if (loadingSpace || errorSpace || !space) {
    return <></>
  }

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceConnectionType.MEMBER}
      forceRestrict={!isAdmin && !isTaskOwner}
      redirectRoute={`/spaces/${spaceIdOrName}`}
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
          regularity={regularity}
          contactEmail={contactEmail}
          slotsAvailable={slotsAvailable}
          thumbnail={thumbnail}
          thumbnailBlurhash={thumbnailBlurhash}
          skills={skills}
          geolocation={geolocation}
          selectedLocation={selectedLocation}
          contactPhone={contactPhone}
          currentThumbnail={currentThumbnail}
          /* TODO TASK TIMING: pass the timeFrameSectionProps after implementing the Task Timing feature in the BE */
          // timeFrameSectionProps={timeFrameSectionProps}
          onChangeName={setName}
          onChangeDescription={setDescription}
          onChangeVisibility={setVisibility}
          onChangeLocationType={setLocationType}
          onChangeRegularity={setRegularity}
          onChangeContactEmail={setContactEmail}
          onChangeSlotsAvailable={setSlotsAvailable}
          onChangeThumbnail={setThumbnail}
          onChangeSkills={setSkills}
          onChangeGeolocation={setGeolocation}
          onChangeContactPhone={setContactPhone}
          onChangeSelectedLocation={setSelectedLocation}
          fieldErrors={fieldErrors}
          isEdit
          isAdmin={isAdmin}
        />
      </SpaceFormScreenLayout>
    </PermissionsGuard>
  )
}

export default EditTask
