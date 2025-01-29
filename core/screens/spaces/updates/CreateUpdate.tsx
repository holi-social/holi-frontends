import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceFormScreenLayout from '@holi/core/screens/spaces/components/SpaceFormScreenLayout'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import SpaceUpdateInputForm from '@holi/core/screens/spaces/updates/components/SpaceUpdateInputForm'
import useCreateOrUpdateSpacePost from '@holi/core/screens/spaces/updates/useUpdateSpaceUpdates'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { useTheme } from '@holi/ui/styles/theme'

export type CreateUpdateParams = {
  spaceIdOrName: string
  postId?: string
}

const { useParam, useUUIDParam } = createParamHooks<CreateUpdateParams>()

const CreateSpaceUpdate = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const [postId] = useUUIDParam('postId')

  const { theme } = useTheme()
  const { colors } = theme

  //input fields
  const {
    loading,
    error,
    isUpdate,
    space,
    title,
    setTitle,
    content,
    setContent,
    image,
    currentImage,
    setImage,
    visibility,
    setVisibility,
    saveSpacePost,
  } = useCreateOrUpdateSpacePost(spaceIdOrName, postId)

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

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

  const onChangeImage = (image: HoliImageInfo | null) => {
    setImage(image)
  }

  useIsomorphicLayoutEffect(() => {
    if (!loading && isMember) {
      setScreenOptions({
        animation: 'slide_from_bottom',
        title: isUpdate ? t('spaces.updates.edit') : t('spaces.updates.create'),
        headerStyle: { backgroundColor: colors.background20 },
        headerLeft: () => <HeaderBackButton onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
    } else {
      setScreenOptions({
        headerStyle: { backgroundColor: colors.background20 },
      })
    }
  }, [setScreenOptions, t, loading, isUpdate, isMember, colors.background20])

  if (error || !space) {
    return <></>
  }

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceConnectionType.MEMBER}
    >
      <SpaceFormScreenLayout
        saveButtonDisabled={saveButtonDisabled}
        toggleConfirmationModal={setShowConfirmationModal}
        onSave={saveSpacePost}
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
          currentImageUri={currentImage?.url}
          isAdmin={isAdmin}
        />
      </SpaceFormScreenLayout>
    </PermissionsGuard>
  )
}

export default memo(CreateSpaceUpdate)
