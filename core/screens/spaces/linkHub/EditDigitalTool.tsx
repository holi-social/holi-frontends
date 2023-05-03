import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import DigitalToolInputForm, {
  COLLECTION_TYPES,
} from '@holi/core/screens/spaces/linkHub/components/DigitalToolInputForm'
import {
  SpaceByIdResponse,
  UpdateCollaborationToolResponse,
  UpdateCollaborationToolSchema,
  spaceByIdQuery,
  updateCollaborationToolMutation,
} from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type EditDigitalToolParams = {
  spaceIdOrName: string
  toolIdOrName: string
}

const { useParam } = createParam<EditDigitalToolParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const EditDigitalTool: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [toolIdOrName] = useParam('toolIdOrName')
  const { height: deviceHeight } = useWindowDimensions()
  const { setOptions, navigateBack, navigate } = useUnifiedNavigation()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | undefined>('')
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [thumbnail, setThumbnail] = useState<ImageInfo | undefined>()
  const [selectedCollection, setSelectedCollection] = useState<HoliModalSelectOption | undefined>()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const [currentThumbnail, setCurrentThumbnail] = useState<string | undefined>()
  const { openToast } = useToast()

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

  const [updateCollaborationTool, { loading }] = useMutation<UpdateCollaborationToolResponse>(
    updateCollaborationToolMutation,
    {
      onCompleted: () => {
        openToast(t('spaces.digitalTool.edit.success'), HoliToastType.SUCCESS)
        navigateBack()
      },
      onError: (error) => setFieldErrors(handleGraphQLError(error)),
      refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: spaceIdOrName } }],
    }
  )

  const onSave = () =>
    updateCollaborationTool({
      variables: {
        input: {
          id: toolIdOrName,
          url,
          title,
          description,
          collectionType: selectedCollection?.id,
          thumbnail: thumbnail?.blob,
        },
      },
    })

  useLayoutEffect(() => {
    !loadingSpace &&
      setOptions({
        animation: 'slide_from_bottom',
        title: '',
        headerStyle: { backgroundColor: colors.background20 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon="arrow-down-s" onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
  }, [setOptions, t, loadingSpace])

  useEffect(() => {
    if (url.length > 0 && title.length > 0 && !!selectedCollection) {
      setSaveButtonDisabled(false)
    }
  }, [url, title, selectedCollection])

  useEffect(() => {
    if (space) {
      const collaborationTools = space ? space.collaborationTools : []
      if (collaborationTools && collaborationTools.length > 0 && toolIdOrName) {
        const digitalTool = collaborationTools.filter((tool) => tool.id === toolIdOrName)[0]
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
      }
    }
  }, [space, toolIdOrName, t])

  useEffect(() => {
    const resultSchema = UpdateCollaborationToolSchema.safeParse({
      spaceId: space?.id,
      ...(title ? { title } : {}),
      ...(url ? { url } : {}),
      ...(selectedCollection?.id ? { collectionType: selectedCollection?.id } : {}),
      ...(description ? { description } : {}),
    })

    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
    } else {
      setFieldErrors({})
    }
  }, [description, selectedCollection?.id, space?.id, title, url])

  const onChangeUrl = (url: string) => {
    setUrl(url)
  }

  const onChangeTitle = (title: string) => {
    setTitle(title)
  }

  const onChangeDescription = (description: string) => {
    setDescription(description)
  }

  if (errorSpace) {
    logError(errorSpace, `[EditSpace.tsx] ${errorSpace.message}`)
  }

  if (!loadingSpace && !isMember) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loadingSpace || errorSpace || !space || !isMember) {
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
            onPress={() => navigateBack()}
          >
            {t('global.dismiss')}
          </HoliButton>
          <HoliButtonLoading
            disabled={saveButtonDisabled || loading}
            icon={loading ? 'loader-4' : undefined}
            iconSpinning={loading}
            label={t('global.save')}
            onPress={onSave}
            testID="digital-tool-edit-modal-save-btn"
            style={styles.footerButton}
          />
        </View>
      </View>
    )
  }

  return (
    <>
      <DefaultScrollHeaderLayout style={styles.defaultLayout} contentStyle={styles.contentStyle} headerOverlap>
        <View
          style={[mixins.container, styles.container, { minHeight: deviceHeight, paddingTop: vars.topBarHeight + 40 }]}
        >
          <HoliText size="large" style={styles.title}>
            {t('spaces.digitalTool.edit.title')}
          </HoliText>
          <DigitalToolInputForm
            onChangeUrl={onChangeUrl}
            onChangeTitle={onChangeTitle}
            onChangeDescription={onChangeDescription}
            onSelectCollection={setSelectedCollection}
            selectedCollection={selectedCollection}
            onChangeThumbnail={setThumbnail}
            url={url}
            title={title}
            description={description}
            thumbnail={thumbnail}
            fieldErrors={fieldErrors}
            currentThumbnail={currentThumbnail}
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
        dismissText={t('spaces.digitalTool.edit.close.dialog.cancel.button.label')}
        confirmText={t('spaces.digitalTool.edit.close.dialog.confirm.button.label')}
        testID="exit-edit-digitalTool-confirmation"
        onConfirm={() => {
          setShowConfirmationModal(false)
          navigateBack()
        }}
      />
    </>
  )
}

export default EditDigitalTool

const styles = StyleSheet.create({
  defaultLayout: {
    backgroundColor: colors.background20,
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
  title: {
    marginVertical: 24,
  },
  footerContainer: {
    width: '100%',
  },
  footer: {
    bottom: 40,
    position: 'absolute',
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
