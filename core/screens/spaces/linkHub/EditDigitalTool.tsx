import { useMutation } from '@apollo/client/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import { validateUrl, withProtocol } from '@holi/core/helpers/url'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceFormScreenLayout from '@holi/core/screens/spaces/components/SpaceFormScreenLayout'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import DigitalToolInputForm, {
  COLLECTION_TYPES,
} from '@holi/core/screens/spaces/linkHub/components/DigitalToolInputForm'
import {
  type UpdateCollaborationToolResponse,
  UpdateCollaborationToolSchema,
  updateCollaborationToolMutation,
} from '@holi/core/screens/spaces/linkHub/mutations'
import { ArrowDownS } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { useTheme } from '@holi/ui/styles/theme'
import { type CollectionType, SpaceByIdDocument, SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

export type EditDigitalToolParams = {
  spaceIdOrName: string
  toolIdOrName: string
}

const { useParam } = createParamHooks<EditDigitalToolParams>()

const EditDigitalTool = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [toolId] = useParam('toolIdOrName')
  const { navigateBack } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState<string | undefined>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | undefined>('')
  const [thumbnail, setThumbnail] = useState<HoliImageInfo | undefined>()
  const [thumbnailBlurhash, setCurrentThumbnailBlurhash] = useState<string | undefined>()
  const [selectedCollectionType, setSelectedCollectionType] = useState<CollectionType | undefined>()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const [currentThumbnail, setCurrentThumbnail] = useState<string | undefined>()
  const [inputValid, setInputValid] = useState(true)
  const { openToast } = useToast()
  const { theme } = useTheme()
  const { colors } = theme

  const { loading: loadingSpace, error: errorSpace, space } = useSpace(spaceIdOrName)

  useEffect(() => {
    if (space) {
      const collaborationTools = space ? space.collaborationTools : []
      if (collaborationTools.length > 0 && toolId) {
        const digitalTool = collaborationTools.find((tool) => tool.id === toolId)
        const collectionType = COLLECTION_TYPES.filter((cType) => cType === digitalTool?.collectionType)[0]
        const toolCollectionType = {
          id: collectionType,
          selected: true,
          title: t(`spaces.toolKit.linkhub.collection.${collectionType}`),
        }
        setUrl(digitalTool?.url ?? '')
        setTitle(digitalTool?.title ?? '')
        setDescription(digitalTool?.description ?? '')
        setSelectedCollectionType(toolCollectionType?.id ?? '')
        setCurrentThumbnail(digitalTool?.thumbnail ?? '')
        setCurrentThumbnailBlurhash(digitalTool?.thumbnailBlurhash)
      }
    }
  }, [space, toolId, t])

  const [updateCollaborationTool] = useMutation<UpdateCollaborationToolResponse>(updateCollaborationToolMutation, {
    onCompleted: () => {
      openToast(t('spaces.digitalTool.edit.success'), HoliToastType.SUCCESS)
      return navigateBack()
    },
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        setFieldErrors(handleGraphQLError(error))
      }
    },
    refetchQueries: [{ query: SpaceByIdDocument, variables: { idOrName: spaceIdOrName } }],
  })

  const { handleGraphQLError } = useFieldErrors({
    handledFieldErrors: ['url', 'title', 'description'],
  })

  const onSave = () => {
    return updateCollaborationTool({
      variables: {
        input: {
          id: toolId,
          url: withProtocol(url),
          title,
          description,
          collectionType: selectedCollectionType,
          thumbnail: thumbnail?.blob,
        },
      },
    })
  }

  useEffect(() => {
    if (url.length > 0 && !validateUrl(url)) {
      setUrlError(t('global.validation.url.invalid'))
    } else {
      setUrlError(undefined)
    }
  }, [t, url])

  useIsomorphicLayoutEffect(() => {
    if (!loadingSpace) {
      setScreenOptions({
        animation: 'slide_from_bottom',
        title: '',
        headerStyle: { backgroundColor: colors.background20 },
        headerLeft: () => <HeaderBackButton icon={ArrowDownS} onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
    }
  }, [t, loadingSpace, setScreenOptions, colors.background20])

  useEffect(() => {
    const resultSchema = UpdateCollaborationToolSchema.safeParse({
      spaceId: space?.id,
      ...(title ? { title } : {}),
      ...(url ? { url } : {}),
      ...(selectedCollectionType ? { collectionType: selectedCollectionType } : {}),
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
  }, [description, selectedCollectionType, space?.id, title, url])

  // Error and loading states are handled the same way and just hide the component
  if (loadingSpace || errorSpace || !space) {
    return <></>
  }

  const saveButtonDisabled = !(url.length > 0 && title.length > 0 && !!selectedCollectionType && inputValid)

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceUserConnectionType.Member}
    >
      <SpaceFormScreenLayout
        title={t('spaces.digitalTool.edit.title')}
        saveButtonDisabled={saveButtonDisabled}
        toggleConfirmationModal={setShowConfirmationModal}
        onSave={onSave}
        showConfirmationModal={showConfirmationModal}
        fallbackRoute={`/spaces/${spaceIdOrName}/linkhub`}
      >
        <DigitalToolInputForm
          onChangeUrl={setUrl}
          onChangeTitle={setTitle}
          onChangeDescription={setDescription}
          onSelectCollectionType={setSelectedCollectionType}
          selectedCollectionType={selectedCollectionType}
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
