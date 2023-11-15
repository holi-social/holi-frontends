import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { logError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import { urlRegex } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceFormScreenLayout from '@holi/core/screens/spaces/components/SpaceFormScreenLayout'
import DigitalToolInputForm, {
  COLLECTION_TYPES,
} from '@holi/core/screens/spaces/linkHub/components/DigitalToolInputForm'
import {
  UpdateCollaborationToolResponse,
  UpdateCollaborationToolSchema,
  updateCollaborationToolMutation,
} from '@holi/core/screens/spaces/linkHub/mutations'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { ArrowDownS } from '@holi/icons/src/generated'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors } from '@holi/ui/styles/globalVars'

export type EditDigitalToolParams = {
  spaceIdOrName: string
  toolIdOrName: string
}

const { useParam } = createParam<EditDigitalToolParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const EditDigitalTool: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [toolId] = useParam('toolIdOrName')
  const { navigateBack } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState<string | undefined>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | undefined>('')
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [thumbnail, setThumbnail] = useState<HoliImageInfo | undefined>()
  const [thumbnailBlurhash, setCurrentThumbnailBlurhash] = useState<string | undefined>()
  const [selectedCollection, setSelectedCollection] = useState<HoliModalSelectOption | undefined>()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const [currentThumbnail, setCurrentThumbnail] = useState<string | undefined>()
  const [inputValid, setInputValid] = useState(true)
  const { openToast } = useToast()

  const {
    data,
    error: errorSpace,
    loading: loadingSpace,
  } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
    onError: (error) =>
      logError(error, 'Failed to load space', {
        location: 'EditDigitalTool.spaceByIdQuery',
        spaceIdOrName,
        toolId,
      }),
  })

  const space = data?.spaceById

  const { handleGraphQLError } = useFieldErrors({
    handledFieldErrors: ['url', 'title', 'description'],
  })

  const [updateCollaborationTool] = useMutation<UpdateCollaborationToolResponse>(updateCollaborationToolMutation, {
    onCompleted: () => {
      openToast(t('spaces.digitalTool.edit.success'), HoliToastType.SUCCESS)
      navigateBack()
    },
    onError: (error) => setFieldErrors(handleGraphQLError(error)),
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: spaceIdOrName } }],
  })

  const onSave = () => {
    const urlWithProtocol = !url.startsWith('http://') && !url.startsWith('https://') ? `https://${url}` : url

    return updateCollaborationTool({
      variables: {
        input: {
          id: toolId,
          url: urlWithProtocol,
          title,
          description,
          collectionType: selectedCollection?.id,
          thumbnail: thumbnail?.blob,
        },
      },
    })
  }

  useEffect(() => {
    if (!urlRegex.test(url)) {
      setUrlError(t('spaces.input.publicLinks.validation.url.invalid'))
    } else {
      setUrlError(undefined)
    }
  }, [t, url])

  useLayoutEffect(() => {
    !loadingSpace &&
      setScreenOptions({
        animation: 'slide_from_bottom',
        title: '',
        headerStyle: { backgroundColor: colors.background20 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon={ArrowDownS} onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
  }, [t, loadingSpace, setScreenOptions])

  useEffect(() => {
    if (url.length > 0 && title.length > 0 && !!selectedCollection && inputValid) {
      setSaveButtonDisabled(false)
    }
  }, [url, title, selectedCollection, inputValid])

  useEffect(() => {
    if (space) {
      const collaborationTools = space ? space.collaborationTools : []
      if (collaborationTools && collaborationTools.length > 0 && toolId) {
        const digitalTool = collaborationTools.filter((tool) => tool.id === toolId)[0]
        const collectionType = COLLECTION_TYPES.filter(
          (collection_type) => collection_type === digitalTool.collectionType
        )[0]
        const toolCollectionType = {
          id: collectionType,
          selected: true,
          title: t(`spaces.toolKit.linkhub.collection.${collectionType}`),
        }
        setUrl(digitalTool.url)
        setTitle(digitalTool.title)
        setDescription(digitalTool.description)
        setSelectedCollection(toolCollectionType)
        setCurrentThumbnail(digitalTool.thumbnail)
        setCurrentThumbnailBlurhash(digitalTool.thumbnailBlurhash)
      }
    }
  }, [space, toolId, t])

  useEffect(() => {
    const resultSchema = UpdateCollaborationToolSchema.safeParse({
      spaceId: space?.id,
      ...(title ? { title } : {}),
      ...(url ? { url } : {}),
      ...(selectedCollection?.id ? { collectionType: selectedCollection?.id } : {}),
      ...(description ? { description } : {}),
    })

    if (resultSchema.success) {
      setInputValid(resultSchema.success)
    }

    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
    } else {
      setFieldErrors({})
    }
  }, [description, selectedCollection?.id, space?.id, title, url])

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
        title={t('spaces.digitalTool.edit.title')}
        saveButtonDisabled={saveButtonDisabled}
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
          thumbnailBlurhash={thumbnailBlurhash}
          fieldErrors={urlError ? { url: [urlError] } : fieldErrors}
          currentThumbnail={currentThumbnail}
        />
      </SpaceFormScreenLayout>
    </PermissionsGuard>
  )
}

export default EditDigitalTool
