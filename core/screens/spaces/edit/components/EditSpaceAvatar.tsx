import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getAvatarSize } from '@holi/core/components/ImageUploader'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import EditSpaceModalWithFooter from '@holi/core/screens/spaces/edit/components/EditSpaceModalWithFooter'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

type EditSpaceAvatarProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceAvatar: React.VFC<EditSpaceAvatarProps> = ({ space, onDismiss }: EditSpaceAvatarProps) => {
  const [avatar, setAvatar] = useState<HoliImageInfo | null>()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const { width: deviceWidth } = useClientWindowDimensions()

  const handleImageUpload = (image: HoliImageInfo | null) => {
    setAvatar(image)
  }

  const [updateSpace] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (error) =>
      displayError(error, 'Failed to update space', { location: 'EditSpaceAvatar.updateSpace', spaceId: space.id }),
  })

  const { t } = useTranslation()

  const placeholderSpace = { avatar: avatar?.uri, avatarDefaultColor: space.avatarDefaultColor, title: space.title }

  const onSave = () =>
    updateSpace({ variables: { input: { id: space.id, avatar: avatar === null ? null : avatar?.blob } } })

  return (
    <EditSpaceModalWithFooter onDismiss={onDismiss} onSave={onSave}>
      <SpaceImageForm
        description={t('spaces.edit.avatar.description')}
        onUploadImage={handleImageUpload}
        image={avatar}
        blurhash={space.avatarBlurhash}
        currentImageUri={placeholderSpace.avatar}
        previewVariant="space"
        placeholder={<SpaceAvatar space={placeholderSpace} size={getAvatarSize(deviceWidth).size} />}
      />
    </EditSpaceModalWithFooter>
  )
}

export default EditSpaceAvatar
