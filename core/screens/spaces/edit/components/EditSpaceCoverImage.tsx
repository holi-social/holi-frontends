import { useMutation } from '@apollo/client/react'
import type React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Space } from '@holi/api/graphql/graphql-codegen'
import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import EditSpaceModalWithFooter from '@holi/core/screens/spaces/edit/components/EditSpaceModalWithFooter'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

type EditSpaceCoverImageProps = {
  space: Pick<Space, 'id' | 'cover' | 'coverBlurhash'>
  onDismiss: () => void
}

const EditSpaceCoverImage: React.FC<EditSpaceCoverImageProps> = ({ space, onDismiss }: EditSpaceCoverImageProps) => {
  const [coverImage, setCoverImage] = useState<HoliImageInfo>()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const handleImageUpload = (image: HoliImageInfo) => {
    setCoverImage(image)
  }

  const [updateSpace] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (error) =>
      displayError(error, 'Failed to update space', {
        location: 'EditSpaceCoverImage.updateSpace',
        spaceId: space.id,
      }),
  })

  const { t } = useTranslation()

  const onSave = () => updateSpace({ variables: { input: { id: space.id, cover: coverImage?.blob } } })

  return (
    <EditSpaceModalWithFooter onDismiss={onDismiss} onSave={onSave}>
      <SpaceImageForm
        description={t('spaces.input.coverImage.remove.description')}
        onUploadImage={handleImageUpload}
        image={coverImage}
        blurhash={space.coverBlurhash}
        currentImageUri={space.cover}
      />
    </EditSpaceModalWithFooter>
  )
}

export default EditSpaceCoverImage
