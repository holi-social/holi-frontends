import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import EditSpaceModal from '@holi/core/screens/spaces/components/EditSpaceModal'
import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import { updateSpaceMutation } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

type EditSpaceAvatarProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceAvatar: React.VFC<EditSpaceAvatarProps> = ({ space, onDismiss }: EditSpaceAvatarProps) => {
  const [avatar, setAvatar] = useState<ImageInfo | undefined>()
  const { openToast } = useToast()

  const handleImageUpload = (image: ImageInfo | undefined) => {
    setAvatar(image)
  }

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: () => openToast(t('global.technicalError'), HoliToastType.ERROR),
  })

  const { t } = useTranslation()

  const onSave = () => avatar && updateSpace({ variables: { input: { id: space.id, avatar: avatar.blob } } })

  return (
    <EditSpaceModal onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={loading}>
      <SpaceImageForm title={t('spaces.edit.avatar')} onUploadImage={handleImageUpload} image={avatar} />
    </EditSpaceModal>
  )
}

export default EditSpaceAvatar
