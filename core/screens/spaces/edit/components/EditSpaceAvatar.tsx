import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import EditSpaceModal from '@holi/core/screens/spaces/edit/components/EditSpaceModal'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

type EditSpaceAvatarProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceAvatar: React.VFC<EditSpaceAvatarProps> = ({ space, onDismiss }: EditSpaceAvatarProps) => {
  const [avatar, setAvatar] = useState<HoliImageInfo | undefined>()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const handleImageUpload = (image: HoliImageInfo | undefined) => {
    setAvatar(image)
  }

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (error) =>
      displayError(error, 'Failed to update space', { location: 'EditSpaceAvatar.updateSpace', spaceId: space.id }),
  })

  const { t } = useTranslation()

  const onSave = () => updateSpace({ variables: { input: { id: space.id, avatar: avatar?.blob ?? null } } })

  return (
    <EditSpaceModal onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={loading} loading={loading}>
      <SpaceImageForm
        title={t('spaces.edit.avatar')}
        onUploadImage={handleImageUpload}
        image={avatar}
        blurhash={space.avatarBlurhash}
        currentImageUri={space.avatar}
        previewVariant="avatar"
      />
    </EditSpaceModal>
  )
}

export default EditSpaceAvatar
