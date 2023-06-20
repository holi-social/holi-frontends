import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { logError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceFormScreenLayout from '@holi/core/screens/spaces/components/SpaceFormScreenLayout'
import DigitalToolInputForm from '@holi/core/screens/spaces/linkHub/components/DigitalToolInputForm'
import {
  AddCollaborationToolResponse,
  AddCollaborationToolSchema,
  addCollaborationToolMutation,
} from '@holi/core/screens/spaces/linkHub/mutations'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors } from '@holi/ui/styles/globalVars'

export type CreateDigitalToolParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<CreateDigitalToolParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const CreateDigitalTool: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { navigateBack, navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | undefined>()
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [thumbnail, setThumbnail] = useState<HoliImageInfo | undefined>()
  const [selectedCollection, setSelectedCollection] = useState<HoliModalSelectOption | undefined>()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const [inputValid, setInputValid] = useState(true)

  const {
    data,
    error: errorSpace,
    loading: loadingSpace,
  } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const { handleGraphQLError } = useFieldErrors({
    handledFieldErrors: ['url', 'title', 'description'],
  })

  const [addCollaborationTool, { loading }] = useMutation<AddCollaborationToolResponse>(addCollaborationToolMutation, {
    onCompleted: () => navigateBack(),
    onError: (error) => setFieldErrors(handleGraphQLError(error)),
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: spaceIdOrName } }],
  })

  const onSave = () =>
    addCollaborationTool({
      variables: {
        input: {
          url,
          spaceId: space?.id,
          title,
          description,
          collectionType: selectedCollection?.id,
          thumbnail: thumbnail?.blob,
        },
      },
    })

  useLayoutEffect(() => {
    !loadingSpace &&
      isMember &&
      setScreenOptions({
        animation: 'slide_from_bottom',
        title: '',
        headerStyle: { backgroundColor: colors.background20 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon="arrow-down-s" onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
  }, [t, loadingSpace, isMember, setScreenOptions])

  useEffect(() => {
    if (url.length > 0 && title.length > 0 && !!selectedCollection && inputValid) {
      setSaveButtonDisabled(false)
    }
  }, [url, title, selectedCollection, inputValid])

  useEffect(() => {
    const resultSchema = AddCollaborationToolSchema.safeParse({
      spaceId: space?.id,
      ...(title ? { title } : {}),
      ...(url ? { url } : {}),
      ...(selectedCollection?.id ? { collectionType: selectedCollection?.id } : {}),
      ...(description ? { description } : {}),
    })
    setInputValid(resultSchema.success)

    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
    } else {
      setFieldErrors({})
    }
  }, [description, selectedCollection?.id, space?.id, title, url])

  if (errorSpace) {
    logError(errorSpace, `[CreateDigitalTool.tsx] ${errorSpace.message}`)
  }

  if (!loadingSpace && !isMember) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loadingSpace || errorSpace || !space || !isMember) {
    return <></>
  }

  return (
    <SpaceFormScreenLayout
      title={t('spaces.digitalTool.add.title')}
      description={t('spaces.digitalTool.add.description')}
      saveButtonDisabled={saveButtonDisabled}
      saveButtonLoading={loading}
      toggleConfirmationModal={setShowConfirmationModal}
      onSave={onSave}
      showConfirmationModal={showConfirmationModal}
    >
      <DigitalToolInputForm
        onChangeUrl={setUrl}
        onChangeTitle={setTitle}
        onChangeDescription={setDescription}
        onSelectCollection={setSelectedCollection}
        selectedCollection={selectedCollection}
        onChangeThumbnail={setThumbnail}
        url={url}
        title={title}
        description={description}
        thumbnail={thumbnail}
        fieldErrors={fieldErrors}
      />
    </SpaceFormScreenLayout>
  )
}

export default CreateDigitalTool
