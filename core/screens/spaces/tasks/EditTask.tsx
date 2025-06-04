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
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { GeolocationPoint } from '@holi/core/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import type { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { Text } from 'holi-bricks/components/text'
import {
  type InteractionType as CGInteractionType,
  InteractionType,
  LocationType,
  type Task,
  useUpdateTaskMutation,
  type VisibilityType,
} from '@holi/api/graphql/graphql-codegen'

import TaskInputForm from './components/TaskInputForm'
import { UpdateTaskSchema } from './taskSchema'
import { useTiming } from './components/TaskInputForm/sections/TimingSection/useTiming'
import { useTimeFrame } from './components/TaskInputForm/sections/TimeFrameSection/useTimeFrame'

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
  const [impact, setImpact] = useState('')
  const [visibility, setVisibility] = useState<HoliModalSelectOption | undefined>()
  const [locationType, setLocationType] = useState<HoliModalSelectOption | undefined>()
  const [interactionType, setInteractionType] = useState<HoliModalSelectOption<InteractionType> | undefined>()
  const [contactEmail, setContactEmail] = useState('')
  const [interactionSignupLink, setInteractionSignupLink] = useState<string | undefined>('')
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

  const timingSectionProps = useTiming()
  const { onDurationChange, onRegularityChange } = timingSectionProps
  const timeFrameSectionProps = useTimeFrame()
  const { onChangeStart, onChangeEnd, onChangeAnytimeToggle } = timeFrameSectionProps

  const { loading: loadingSpace, error: errorSpace, space } = useSpace(spaceIdOrName)

  const loginState = useLoggedInUser()
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const task = (space?.tasks || []).find((t) => t.id === taskId) as Task | undefined
  const isTaskOwner = loginState.isLoggedIn && task?.creator.id === loginState.user.id

  const { displayError } = useErrorHandling()

  const [updateTask] = useUpdateTaskMutation({
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

  const onSave = async () => {
    if (
      !space?.id ||
      !task?.id ||
      !visibility?.id ||
      !locationType?.id ||
      !timingSectionProps.regularity ||
      !timingSectionProps.duration
    ) {
      return
    }

    return updateTask({
      variables: {
        input: {
          taskId: task?.id,
          spaceId: space?.id,
          name,
          description,
          impact,
          visibility: visibility?.id as VisibilityType,
          locationType: locationType?.id as LocationType,
          interactionType: interactionType?.id as CGInteractionType,
          regularity: timingSectionProps.regularity,
          duration: timingSectionProps.duration,
          timeframeStartDate: timeFrameSectionProps.timeFrame.anytime
            ? undefined
            : timeFrameSectionProps.timeFrame.start.toISOString().split('T')[0],
          timeframeEndDate: timeFrameSectionProps.timeFrame.anytime
            ? undefined
            : timeFrameSectionProps.timeFrame.end.toISOString().split('T')[0],
          contactEmail,
          interactionSignupLink: interactionSignupLink || undefined,
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
      setLocation(selectedLocation?.label || '')
    }
    if (locationType?.id === LocationType.Remote) {
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
      regularity: timingSectionProps.regularity,
      duration: timingSectionProps.duration,
      timeframeStartDate: timeFrameSectionProps.timeFrame.anytime ? undefined : timeFrameSectionProps.timeFrame.start,
      timeframeEndDate: timeFrameSectionProps.timeFrame.anytime ? undefined : timeFrameSectionProps.timeFrame.end,
      interactionType: interactionType?.id,
      skillsV2: skills,
      name,
      description,
      contactEmail,
      interactionSignupLink,
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
    interactionType,
    contactEmail,
    interactionSignupLink,
    slotsAvailable,
    thumbnail,
    skills,
    location,
    geolocation,
    contactPhone,
    timingSectionProps.regularity,
    timingSectionProps.duration,
    timeFrameSectionProps.timeFrame.anytime,
    timeFrameSectionProps.timeFrame.start,
    timeFrameSectionProps.timeFrame.end,
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
      setInteractionType({
        id: task.interactionType ?? InteractionType.Chat,
        title: t(`spaces.input.task.interactionType.${task.interactionType}.title`),
        description: t(`spaces.input.task.interactionType.${task.interactionType}.description`),
      })
      setContactEmail(task.contactEmail)
      setInteractionSignupLink(task.interactionSignupLink)
      setSlotsAvailable(task.slotsAvailable)
      setCurrentThumbnail(task.thumbnail)
      setThumbnailBlurhash(task.thumbnailBlurhash)
      setSkills(task.skillsV2)
      setLocation(task.location)
      setGeolocation(task.geolocation)
      setContactPhone(task.contactPhone)
      setSelectedLocation(task.location ? { label: task.location, id: '', coordinates: task.geolocation } : undefined)
      onDurationChange(task.duration)
      onRegularityChange(task.regularity)
      if (task.timeframeStartDate && task.timeframeEndDate) {
        onChangeStart(task.timeframeStartDate)
        onChangeEnd(task.timeframeEndDate)
      } else {
        onChangeAnytimeToggle(true)
      }
    }
  }, [task, t, onDurationChange, onRegularityChange, onChangeStart, onChangeEnd, onChangeAnytimeToggle])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTitle: () => (
        <Text headingLevel="1" size="lg">
          {t('spaces.tasks.edit.title')}
        </Text>
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
      !!interactionType &&
      !!contactEmail &&
      !!timingSectionProps.duration &&
      !!timingSectionProps.regularity &&
      inputValid
    ) {
      setSaveButtonDisabled(false)
    }
  }, [
    name,
    description,
    visibility,
    locationType,
    interactionType,
    contactEmail,
    interactionSignupLink,
    inputValid,
    timingSectionProps.duration,
    timingSectionProps.regularity,
  ])

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
          impact={impact}
          visibility={visibility}
          locationType={locationType}
          interactionType={interactionType}
          contactEmail={contactEmail}
          interactionSignupLink={interactionSignupLink}
          slotsAvailable={slotsAvailable}
          thumbnail={thumbnail}
          thumbnailBlurhash={thumbnailBlurhash}
          skills={skills}
          geolocation={geolocation}
          selectedLocation={selectedLocation}
          contactPhone={contactPhone}
          currentThumbnail={currentThumbnail}
          timingSectionProps={timingSectionProps}
          timeFrameSectionProps={timeFrameSectionProps}
          onChangeName={setName}
          onChangeDescription={setDescription}
          onChangeImpact={setImpact}
          onChangeVisibility={setVisibility}
          onChangeLocationType={setLocationType}
          onChangeInteractionType={setInteractionType}
          onChangeContactEmail={setContactEmail}
          onChangeInteractionSignupLink={setInteractionSignupLink}
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
