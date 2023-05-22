import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import SpaceFormScreenLayout from '@holi/core/screens/spaces/components/SpaceFormScreenLayout'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType, VisibilityFilter } from '@holi/core/screens/spaces/types'
import { VisibilityType } from '@holi/core/screens/spaces/types'
import SpaceUpdateInputForm from '@holi/core/screens/spaces/updates/components/SpaceUpdateInputForm'
import { CreateSpacePostResponse, createSpacePostMutation } from '@holi/core/screens/spaces/updates/mutations'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors } from '@holi/ui/styles/globalVars'

export type CreateUpdateParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<CreateUpdateParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const CreateUpdate: React.FC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { setOptions, navigateBack } = useUnifiedNavigation()
  const { t } = useTranslation()
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

  return (
    <>
      <SpaceFormScreenLayout
        saveButtonDisabled={saveButtonDisabled}
        saveButtonLoading={loading}
        toggleConfirmationModal={setShowConfirmationModal}
        onSave={onSave}
        showConfirmationModal={showConfirmationModal}
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
      </SpaceFormScreenLayout>
    </>
  )
}

export default CreateUpdate
