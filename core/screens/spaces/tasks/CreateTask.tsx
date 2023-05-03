import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useErrorHandling } from '@holi/core/errors/hooks'
import { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import {
  CreateTaskResponse,
  CreateTaskSchema,
  SpaceByIdResponse,
  createTaskMutation,
  spaceByIdQuery,
} from '@holi/core/screens/spaces/queries'
import TaskInputForm from '@holi/core/screens/spaces/tasks/components/TaskInputForm'
import { Geolocation, LocationType, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Skill } from '@holi/core/screens/userprofile/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CreateTaskParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<CreateTaskParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const DEFAULT_SLOTS_AVAILABLE = 1

const CreateTask: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { height: deviceHeight } = useWindowDimensions()
  const { setOptions, navigateBack, navigate } = useUnifiedNavigation()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')

  // input fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<HoliModalSelectOption | undefined>()
  const [locationType, setLocationType] = useState<HoliModalSelectOption | undefined>()
  const [regularity, setRegularity] = useState<HoliModalSelectOption | undefined>()
  const [contactEmail, setContactEmail] = useState('')
  const [slotsAvailable, setSlotsAvailable] = useState(DEFAULT_SLOTS_AVAILABLE)
  const [thumbnail, setThumbnail] = useState<ImageInfo | undefined>()
  const [skills, setSkills] = useState<Skill[]>([])
  const [location, setLocation] = useState<string | undefined>('')
  const [geolocation, setGeolocation] = useState<Geolocation | undefined>()
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
      setOptions({
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
  }, [setOptions, t, loadingSpace, isAdmin])

  useEffect(() => {
    if (name.length > 0 && description.length > 0 && !!visibility && !!locationType && !!regularity && !!contactEmail) {
      setSaveButtonDisabled(false)
    }
  }, [name, description, visibility, locationType, regularity, contactEmail])

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

  const Footer = () => {
    return (
      <View style={styles.footerContainer}>
        <View style={[mixins.container, styles.footer]}>
          <HoliButton
            label={t('global.dismiss')}
            type="secondary"
            inline
            style={styles.footerButton}
            onPress={() => setShowConfirmationModal(true)}
          >
            {t('global.dismiss')}
          </HoliButton>
          <HoliButtonLoading
            disabled={saveButtonDisabled || loading || !inputValid}
            icon={loading ? 'loader-4' : undefined}
            iconSpinning={loading}
            label={t('global.save')}
            onPress={onSave}
            testID="task-modal-save-btn"
            style={styles.footerButton}
          />
        </View>
      </View>
    )
  }

  return (
    <SpaceTermContextProvider>
      <DefaultScrollHeaderLayout
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
        headerOverlap
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[mixins.container, styles.container, { minHeight: deviceHeight, paddingTop: vars.topBarHeight + 40 }]}
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
            location={location}
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
            onChangeLocation={setLocation}
            onChangeGeolocation={setGeolocation}
            onChangeContactPhone={setContactPhone}
            onChangeSelectedLocation={setSelectedLocation}
            fieldErrors={fieldErrors}
          />
        </View>
      </DefaultScrollHeaderLayout>
      <Footer />

      <HoliConfirmation
        show={showConfirmationModal}
        label={exitConfirmationTitle}
        title={exitConfirmationTitle}
        description={t('global.leavePage.confirmation.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('global.dismiss')}
        confirmText={t('global.leavePage.confirmation.button')}
        testID="exit-create-task-confirmation"
        onConfirm={() => {
          setShowConfirmationModal(false)
          navigateBack()
        }}
      />
    </SpaceTermContextProvider>
  )
}

export default CreateTask

const styles = StyleSheet.create({
  defaultLayout: {
    backgroundColor: colors.background20,
    paddingTop: 16,
  },
  contentStyle: {
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    paddingBottom: 132,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  footerContainer: {
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    margin: -7,
    ...Platform.select({
      web: {
        alignSelf: 'center',
        position: 'fixed',
      },
    }),
  },
  footerButton: {
    flex: 1,
    margin: 7,
    ...Platform.select({
      web: {
        margin: 0,
      },
    }),
  },
})
