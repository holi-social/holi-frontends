import { useMutation } from '@apollo/client/react'
import type React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Space } from '@holi/api/graphql/graphql-codegen'
import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import EditSpaceModalWithFooter from '@holi/core/screens/spaces/edit/components/EditSpaceModalWithFooter'
import { updateSpaceMutation, type UpdateSpaceResponse } from '@holi/core/screens/spaces/edit/mutations'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

type EditSpaceAvatarProps = {
  space: Pick<Space, 'id' | 'avatar' | 'avatarBlurhash'>
  onDismiss: () => void
}

const EditSpaceAvatar: React.FC<EditSpaceAvatarProps> = ({ space, onDismiss }: EditSpaceAvatarProps) => {
  const [avatar, setAvatar] = useState<HoliImageInfo | null>()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const handleImageUpload = (image: HoliImageInfo | null) => {
    setAvatar(image)
  }

  const [updateSpace] = useMutation<UpdateSpaceResponse>(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (error) =>
      displayError(error, 'Failed to update space', { location: 'EditSpaceAvatar.updateSpace', spaceId: space.id }),
  })

  const { t } = useTranslation()

  const onSave = () =>
    updateSpace({ variables: { input: { id: space.id, avatar: avatar === null ? null : avatar?.blob } } })

  return (
    <EditSpaceModalWithFooter onDismiss={onDismiss} onSave={onSave}>
      <SpaceImageForm
        description={t('spaces.edit.avatar.description')}
        onUploadImage={handleImageUpload}
        image={avatar}
        blurhash={space.avatarBlurhash}
        currentImageUri={space.avatar}
        previewVariant="avatar"
      />
    </EditSpaceModalWithFooter>
  )
}

export default EditSpaceAvatar
