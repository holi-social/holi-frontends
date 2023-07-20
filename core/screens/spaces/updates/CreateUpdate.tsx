import React, { memo, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { logError } from '@holi/core/errors/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceFormScreenLayout from '@holi/core/screens/spaces/components/SpaceFormScreenLayout'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import SpaceUpdateInputForm from '@holi/core/screens/spaces/updates/components/SpaceUpdateInputForm'
import useCreateOrUpdateSpacePost from '@holi/core/screens/spaces/updates/useUpdateSpaceUpdates'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { colors } from '@holi/ui/styles/globalVars'

export type CreateUpdateParams = {
  spaceIdOrName: string
  postId?: string
}

const { useParam } = createParam<CreateUpdateParams>()

const CreateSpaceUpdate = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const [postId] = useParam('postId')

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

  const onChangeImage = (image: HoliImageInfo | undefined) => {
    setImage(image)
  }

  if (error) {
    logError(error, `[CreateUpdate.tsx] ${error.message}`)
  }

  useLayoutEffect(() => {
    !loading &&
      isMember &&
      setScreenOptions({
        animation: 'slide_from_bottom',
        title: isUpdate ? t('spaces.updates.edit') : t('spaces.updates.create'),
        headerStyle: { backgroundColor: colors.background20 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
  }, [setScreenOptions, t, loading, isUpdate, isMember])

  if (error || !space || !isMember) {
    return <></>
  }

  if (loading) {
    return <HoliLoader />
  }

  return (
    <>
      <SpaceFormScreenLayout
        saveButtonDisabled={saveButtonDisabled}
        saveButtonLoading={loading}
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
          isAdmin={isAdmin}
        />
      </SpaceFormScreenLayout>
    </>
  )
}

export default memo(CreateSpaceUpdate)
