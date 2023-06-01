import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType, VisibilityFilter } from '@holi/core/screens/spaces/types'
import { VisibilityType } from '@holi/core/screens/spaces/types'
import SpaceUpdateInputForm from '@holi/core/screens/spaces/updates/components/SpaceUpdateInputForm'
import { CreateSpacePostResponse, createSpacePostMutation } from '@holi/core/screens/spaces/updates/mutations'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CreateUpdateParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<CreateUpdateParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const CreateUpdate: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { setOptions, navigateBack } = useUnifiedNavigation()
  const { height: deviceHeight } = useWindowDimensions()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')

  //input fields
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [image, setImage] = useState<HoliImageInfo | undefined>()
  const [visibility, setVisibility] = useState<HoliModalSelectOption | undefined>()

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const {
    data,
    error: errorSpace,
    loading: loadingSpace,
  } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const { displayError } = useErrorHandling()

  const [createSpacePost, { loading }] = useMutation<CreateSpacePostResponse>(createSpacePostMutation, {
    onCompleted: () => navigateBack(),
    onError: (error) => displayError(error, error.message),
    refetchQueries: [
      {
        query: spacePostsQuery,
        variables: { idOrName: space?.name, offset: 0, limit: 10, visibility: VisibilityFilter.ALL },
      },
    ],
  })

  useLayoutEffect(() => {
    !loadingSpace &&
      isMember &&
      setOptions({
        animation: 'slide_from_bottom',
        title: t('spaces.createUpdate.title'),
        headerStyle: { backgroundColor: colors.background20 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon="arrow-left" onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
  }, [setOptions, t, loadingSpace, isMember])

  const isEmpty = (value: string) => {
    return /^\s*$/.test(value)
  }

  useEffect(() => {
    if (!isEmpty(content) && content.length > 0) {
      setSaveButtonDisabled(false)
    } else {
      setSaveButtonDisabled(true)
    }
  }, [content, visibility])

  const onChangeTitle = (title: string) => {
    setTitle(title)
  }

  const onChangeContent = (content: string) => {
    setContent(content)
  }

  const onChangeImage = (image: HoliImageInfo | undefined) => {
    setImage(image)
  }
  if (errorSpace) {
    logError(errorSpace, `[CreateUpdate.tsx] ${errorSpace.message}`)
  }
  // Error and loading states are handled the same way and just hide the component
  if (loadingSpace || errorSpace || !space || !isMember) {
    return <></>
  }

  const onSave = () => {
    createSpacePost({
      variables: {
        input: {
          spaceId: space?.id,
          title: title.trim() && title.length > 0 ? title : undefined,
          text: content.trim(),
          image: image?.blob,
          visibility: visibility ? visibility?.id : VisibilityType.MEMBERS,
        },
      },
    })
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
            onPress={() => onSave()}
            testID="create-post-modal-save-btn"
            style={styles.footerButton}
          />
        </View>
      </View>
    )
  }

  return (
    <>
      <ScrollHeaderLayout.Default
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
        headerOverlap
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[mixins.container, styles.container, { minHeight: deviceHeight, paddingTop: vars.topBarHeight + 40 }]}
        >
          <SpaceUpdateInputForm
            onChangeVisibility={setVisibility}
            onChangeTitle={onChangeTitle}
            onChangeContent={onChangeContent}
            onUploadImage={onChangeImage}
            visibility={visibility}
            title={title}
            content={content}
            image={image}
            isAdmin={isAdmin}
          />
        </View>
      </ScrollHeaderLayout.Default>

      <Footer />
      <HoliConfirmation
        show={showConfirmationModal}
        label={exitConfirmationTitle}
        title={exitConfirmationTitle}
        description={t('global.leavePage.confirmation.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('global.dismiss')}
        confirmText={t('global.leavePage.confirmation.button')}
        testID="exit-create-post-confirmation"
        onConfirm={() => {
          setShowConfirmationModal(false)
          navigateBack()
        }}
      />
    </>
  )
}

export default CreateUpdate

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
  footerContainer: {
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    ...Platform.select({
      web: {
        position: 'fixed',
        alignSelf: 'center',
      },
    }),
  },
  footerButton: {
    flex: 1,
  },
})
