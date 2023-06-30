import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { logError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useErrorHandling } from '@holi/core/errors/hooks'
import { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceFormScreenLayout from '@holi/core/screens/spaces/components/SpaceFormScreenLayout'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import TaskInputForm from '@holi/core/screens/spaces/tasks/components/TaskInputForm'
import { CreateTaskResponse, CreateTaskSchema, createTaskMutation } from '@holi/core/screens/spaces/tasks/mutations'
import { LocationType, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Skill } from '@holi/core/screens/userprofile/types'
import { GeolocationPoint } from '@holi/core/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors } from '@holi/ui/styles/globalVars'

export type CreateTaskParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<CreateTaskParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const DEFAULT_SLOTS_AVAILABLE = 1

const CreateTask: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { navigateBack, navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()

  // input fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<HoliModalSelectOption | undefined>()
  const [locationType, setLocationType] = useState<HoliModalSelectOption | undefined>()
  const [regularity, setRegularity] = useState<HoliModalSelectOption | undefined>()
  const [contactEmail, setContactEmail] = useState('')
  const [slotsAvailable, setSlotsAvailable] = useState(DEFAULT_SLOTS_AVAILABLE)
  const [thumbnail, setThumbnail] = useState<HoliImageInfo | undefined>()
  const [skills, setSkills] = useState<Skill[]>([])
  const [location, setLocation] = useState<string | undefined>('')
  const [geolocation, setGeolocation] = useState<GeolocationPoint | undefined>()
  const [contactPhone, setContactPhone] = useState<string | undefined>('')

  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>()

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [inputValid, setInputValid] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  const {
    data,
    error: errorSpace,
    loading: loadingSpace,
  } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const { displayError } = useErrorHandling()

  const [createTask, { loading }] = useMutation<CreateTaskResponse>(createTaskMutation, {
    onCompleted: () => navigateBack(),
    onError: (error) => displayError(error, error.message),
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
          skills: skills.map((skill) => skill.id),
          location,
          geolocation,
          contactPhone,
        },
      },
    })

  // If locationType is REMOTE, remove location and coordinates
  // Otherwise set their values based on the selectedLocation
  useEffect(() => {
    if (locationType?.id !== LocationType.REMOTE && selectedLocation?.coordinates) {
      setGeolocation({
        latitude: selectedLocation.coordinates.latitude,
        longitude: selectedLocation.coordinates.longitude,
      })
      setLocation(selectedLocation.label)
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

  useLayoutEffect(() => {
    !loadingSpace &&
      isAdmin &&
      setScreenOptions({
        animation: 'slide_from_bottom',
        headerTitle: () => (
          <HoliHeading level="1" size="small">
            {t('spaces.tasks.add.title')}
          </HoliHeading>
        ),
        headerStyle: { backgroundColor: colors.background10 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon="arrow-left" onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
  }, [t, loadingSpace, isAdmin, setScreenOptions])

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

  if (errorSpace) {
    logError(errorSpace, `[CreateTask.tsx] ${errorSpace.message}`)
  }

  if (!loadingSpace && !isAdmin) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loadingSpace || errorSpace || !space || !isAdmin) {
    return <></>
  }

  return (
    <SpaceFormScreenLayout
      saveButtonDisabled={saveButtonDisabled}
      saveButtonLoading={loading}
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
      />
    </SpaceFormScreenLayout>
  )
}

export default CreateTask
