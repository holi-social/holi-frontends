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

type EditSpaceCoverImageProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceCoverImage: React.VFC<EditSpaceCoverImageProps> = ({ space, onDismiss }: EditSpaceCoverImageProps) => {
  const [coverImage, setCoverImage] = useState<HoliImageInfo | undefined>()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const handleImageUpload = (image: HoliImageInfo | undefined) => {
    setCoverImage(image)
  }

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
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

  const onSave = () => updateSpace({ variables: { input: { id: space.id, cover: coverImage?.blob ?? null } } })

  return (
    <EditSpaceModal onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={loading} loading={loading}>
      <SpaceImageForm
        title={t('spaces.edit.mainImage')}
        description={t('spaces.input.coverImage.remove.description')}
        onUploadImage={handleImageUpload}
        image={coverImage}
        blurhash={space.coverBlurhash}
        currentImageUri={space.cover}
      />
    </EditSpaceModal>
  )
}

export default EditSpaceCoverImage
