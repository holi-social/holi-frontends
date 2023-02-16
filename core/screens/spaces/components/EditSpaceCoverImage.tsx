import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import EditSpaceModal from '@holi/core/screens/spaces/components/EditSpaceModal'
import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import { updateSpaceMutation } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type EditSpaceCoverImageProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceCoverImage: React.VFC<EditSpaceCoverImageProps> = ({ space, onDismiss }: EditSpaceCoverImageProps) => {
  const [coverImage, setCoverImage] = useState<ImageInfo | undefined>()
  const { openToast } = useToast()
  const mixins = useStyleMixins()

  const handleImageUpload = (image: ImageInfo | undefined) => {
    setCoverImage(image)
  }

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: () => openToast(t('global.technicalError'), HoliToastType.ERROR),
  })

  const { t } = useTranslation()

  const onSave = () => coverImage && updateSpace({ variables: { input: { id: space.id, cover: coverImage.blob } } })

  return (
    <EditSpaceModal onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={loading}>
      <SpaceImageForm
        title={t('spaces.edit.mainImage')}
        description={t('spaces.create.space.stepThree.subTitle')}
        onUploadImage={handleImageUpload}
        image={coverImage}
        style={mixins.container}
      />
    </EditSpaceModal>
  )
}

export default EditSpaceCoverImage
