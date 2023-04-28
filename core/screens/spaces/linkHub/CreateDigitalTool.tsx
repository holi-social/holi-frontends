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
import DigitalToolInputForm from '@holi/core/screens/spaces/linkHub/components/DigitalToolInputForm'
import {
  AddCollaborationToolResponse,
  AddCollaborationToolSchema,
  SpaceByIdResponse,
  addCollaborationToolMutation,
  spaceByIdQuery,
} from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CreateDigitalToolParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<CreateDigitalToolParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const CreateDigitalTool: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { height: deviceHeight } = useWindowDimensions()
  const { setOptions, navigateBack, navigate } = useUnifiedNavigation()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string>()
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [thumbnail, setThumbnail] = useState<ImageInfo | undefined>()
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
  }, [setOptions, t, loadingSpace, isMember])

  useEffect(() => {
    if (url.length > 0 && title.length > 0 && !!selectedCollection) {
      setSaveButtonDisabled(false)
    }
  }, [url, title, selectedCollection])

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

  const onChangeUrl = (url: string) => {
    setUrl(url)
  }

  const onChangeTitle = (title: string) => {
    setTitle(title)
  }

  const onChangeDescription = (description: string) => {
    setDescription(description ? description : undefined)
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
            disabled={saveButtonDisabled || !inputValid || loading}
            label={t('global.save')}
            icon={loading ? 'loader-4' : undefined}
            iconSpinning={loading}
            onPress={onSave}
            testID="digital-tool-add-modal-save-btn"
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
          <HoliText size="large">{t('spaces.digitalTool.add.title')}</HoliText>
          <HoliText style={styles.subTitle}>{t('spaces.digitalTool.add.subTitle')}</HoliText>
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
        dismissText={t('spaces.digitalTool.add.close.dialog.cancel.button.label')}
        confirmText={t('spaces.digitalTool.add.close.dialog.confirm.button.label')}
        testID="exit-add-digitalTool-confirmation"
        onConfirm={() => {
          setShowConfirmationModal(false)
          navigateBack()
        }}
      />
    </>
  )
}

export default CreateDigitalTool

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
  subTitle: {
    marginBottom: 32,
    marginTop: 16,
    color: colors.foreground20,
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
        position: 'fixed',
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
