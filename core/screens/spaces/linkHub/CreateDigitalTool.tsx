import { useMutation } from '@apollo/client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

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
import DigitalToolInputForm from '@holi/core/screens/spaces/linkHub/components/DigitalToolInputForm'
import {
  type AddCollaborationToolResponse,
  AddCollaborationToolSchema,
  addCollaborationToolMutation,
} from '@holi/core/screens/spaces/linkHub/mutations'
import { ArrowDownS } from '@holi/icons/src/generated'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { type CollectionType, SpaceByIdDocument, SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

export type CreateDigitalToolParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<CreateDigitalToolParams>()

const CreateDigitalTool = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { navigateBack } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState<string | undefined>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | undefined>()
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [thumbnail, setThumbnail] = useState<HoliImageInfo | undefined>()
  const [selectedCollectionType, setSelectedCollectionType] = useState<CollectionType | undefined>()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const [inputValid, setInputValid] = useState(true)
  const { openToast } = useToast()
  const { track } = useTracking()

  const { loading: loadingSpace, error: errorSpace, space } = useSpace(spaceIdOrName)

  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)

  const { handleGraphQLError } = useFieldErrors({
    handledFieldErrors: ['url', 'title', 'description'],
  })

  const [addCollaborationTool] = useMutation<AddCollaborationToolResponse>(addCollaborationToolMutation, {
    onCompleted: () => {
      track(TrackingEvent.Spaces.LinkHub.linkAdded(space?.id ?? spaceIdOrName ?? '', selectedCollectionType ?? ''))
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

  const onSave = () => {
    return addCollaborationTool({
      variables: {
        input: {
          url: withProtocol(url),
          spaceId: space?.id,
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
    setScreenOptions({
      animation: 'slide_from_bottom',
      title: '',
      headerStyle: styles.background,
      headerLeft: () => <HeaderBackButton icon={ArrowDownS} onPress={() => setShowConfirmationModal(true)} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [t, loadingSpace, isMember, setScreenOptions, styles.background])

  useEffect(() => {
    if (url.length > 0 && title.length > 0 && !!selectedCollectionType && inputValid) {
      setSaveButtonDisabled(false)
    }
  }, [url, title, selectedCollectionType, inputValid])

  useEffect(() => {
    const resultSchema = AddCollaborationToolSchema.safeParse({
      spaceId: space?.id,
      ...(title ? { title } : {}),
      ...(url ? { url } : {}),
      ...(selectedCollectionType ? { collectionType: selectedCollectionType } : {}),
      ...(description ? { description } : {}),
    })
    setInputValid(resultSchema.success)

    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
    } else {
      setFieldErrors({})
    }
  }, [description, selectedCollectionType, space?.id, title, url])

  // Error and loading states are handled the same way and just hide the component
  if (loadingSpace || errorSpace || !space) {
    return (
      <View style={[styles.flex1, styles.background]}>
        <HoliLoader />
      </View>
    )
  }

  return (
    <PermissionsGuard
      space={space}
      spaceConnectionType={SpaceUserConnectionType.Member}
      permissionType={PermissionsType.SPACES}
    >
      <SpaceFormScreenLayout
        title={t('spaces.digitalTool.add.title')}
        description={t('spaces.digitalTool.add.description')}
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
          fieldErrors={urlError ? { url: [urlError] } : fieldErrors}
        />
      </SpaceFormScreenLayout>
    </PermissionsGuard>
  )
}

export default CreateDigitalTool

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    flex1: {
      flex: 1,
    },
    background: {
      backgroundColor: theme.colors.background20,
    },
  })
