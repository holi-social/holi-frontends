import { useMutation } from '@apollo/client'
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
import TaskInputForm from '@holi/core/screens/spaces/tasks/components/TaskInputForm'
import {
  createTaskMutation,
  type CreateTaskResponse,
  CreateTaskSchema,
} from '@holi/core/screens/spaces/tasks/mutations'
import { LocationType, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { GeolocationPoint } from '@holi/core/types'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import type { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { useTheme } from '@holi/ui/styles/theme'

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
  const { theme } = useTheme()
  const { colors } = theme
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
  const [skills, setSkills] = useState<string[]>([])
  const [location, setLocation] = useState<string | undefined>('')
  const [geolocation, setGeolocation] = useState<GeolocationPoint | undefined>()
  const [contactPhone, setContactPhone] = useState<string | undefined>('')

  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>()

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [inputValid, setInputValid] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  const { loading: loadingSpace, error: errorSpace, space } = useSpace(spaceIdOrName)

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const { displayError } = useErrorHandling()

  const [createTask] = useMutation<CreateTaskResponse>(createTaskMutation, {
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

  const onSave = () =>
    createTask({
      variables: {
        input: {
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
      setLocation(selectedLocation?.label)
    }
    if (locationType?.id === LocationType.REMOTE) {
      setGeolocation(undefined)
      setLocation(undefined)
    }
  }, [selectedLocation, locationType])

  useEffect(() => {
    const resultSchema = CreateTaskSchema.safeParse({
      spaceId: space?.id,
      visibility: visibility?.id,
      locationType: locationType?.id,
      regularity: regularity?.id,
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
    regularity,
    contactEmail,
    slotsAvailable,
    thumbnail,
    skills,
    location,
    geolocation,
    contactPhone,
  ])

  useIsomorphicLayoutEffect(() => {
    if (!loadingSpace && isMember) {
      setScreenOptions({
        animation: 'slide_from_bottom',
        headerTitle: () => (
          <HoliHeading level="1" size="s">
            {t('spaces.tasks.add.title')}
          </HoliHeading>
        ),
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderBackButton onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
    }
  }, [t, loadingSpace, isMember, setScreenOptions, colors.background10])

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
          regularity={regularity}
          contactEmail={contactEmail}
          slotsAvailable={slotsAvailable}
          thumbnail={thumbnail}
          skills={skills}
          geolocation={geolocation}
          selectedLocation={selectedLocation}
          contactPhone={contactPhone}
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
          isAdmin={isAdmin}
        />
      </SpaceFormScreenLayout>
    </PermissionsGuard>
  )
}

export default CreateTask
