import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import DigitalToolInputForm, { COLLECTION_TYPES } from '@holi/core/screens/spaces/components/DigitalToolInputForm'
import {
  SpaceByIdResponse,
  UpdateCollaborationToolResponse,
  spaceByIdQuery,
  updateCollaborationToolMutation,
} from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { colors } from '@holi/ui/styles/globalVars'
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
  const exitConfirmationTitle = t('spaces.digitalTool.edit.close.dialog.title')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | undefined>('')
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [thumbnail, setThumbnail] = useState<ImageInfo | undefined>()
  const [selectedCollection, setSelectedCollection] = useState<HoliSelectOption | undefined>()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

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

  const [updateCollaborationTool] = useMutation<UpdateCollaborationToolResponse>(updateCollaborationToolMutation, {
    onCompleted: () => navigateBack(),
    onError: (error) => displayError(error, error.message),
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: spaceIdOrName } }],
  })

  const onSave = () =>
    updateCollaborationTool({
      variables: {
        input: {
          id: toolIdOrName,
          url,
          title,
          description,
          collectionType: selectedCollection?.id,
        },
      },
    })

  useLayoutEffect(() => {
    !loadingSpace &&
      isAdmin &&
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
  }, [setOptions, t, loadingSpace, isAdmin])

  useEffect(() => {
    if (url.length > 0 && title.length > 0 && !!selectedCollection) {
      setSaveButtonDisabled(false)
    }
  }, [url, title, selectedCollection])

  useEffect(() => {
    const collaborationTools = space ? space.collaborationTools : []
    if (collaborationTools && collaborationTools.length > 0 && toolIdOrName) {
      const digitalTool = collaborationTools.filter((tool) => tool.id === toolIdOrName)[0]
      const collectionType = COLLECTION_TYPES.filter((collection) => collection.id === digitalTool.collectionType)[0]
      setUrl(digitalTool.url)
      setTitle(digitalTool.title)
      setDescription(digitalTool.description)
      setSelectedCollection({ ...collectionType, selected: true })
    }
  }, [space, toolIdOrName])

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

  if (!loadingSpace && !isAdmin) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loadingSpace || errorSpace || !space || !isAdmin) {
    return <></>
  }

  const Footer = () => {
    return (
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
          disabled={saveButtonDisabled}
          label={t('global.save')}
          onPress={onSave}
          testID="digital-tool-add-modal-save-btn"
          style={styles.footerButton}
        />
      </View>
    )
  }

  return (
    <>
      <DefaultScrollHeaderLayout style={styles.defaultLayout} contentStyle={styles.contentStyle}>
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
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
            isEdit={true}
          />
        </View>
      </DefaultScrollHeaderLayout>

      <View>
        <Footer />
      </View>

      <HoliConfirmation
        show={showConfirmationModal}
        label={exitConfirmationTitle}
        title={exitConfirmationTitle}
        description={t('spaces.digitalTool.edit.close.dialog.description')}
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
  footer: {
    position: 'fixed',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    margin: -7,
    ...Platform.select({
      web: {
        alignSelf: 'center',
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
