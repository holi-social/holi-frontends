import React from 'react'
import { useTranslation } from 'react-i18next'

import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

export interface SpaceUpdateInputFormProps {
  onChangeTitle: (title: string) => void
  onChangeContent: (title: string) => void
  onUploadImage: (image: ImageInfo | undefined) => void
  title: string
  content: string
  image: ImageInfo | undefined
}

const SpaceUpdateInputForm: React.VFC<SpaceUpdateInputFormProps> = ({
  onChangeTitle,
  onChangeContent,
  onUploadImage,
  title,
  content,
  image,
}: SpaceUpdateInputFormProps) => {
  const { t } = useTranslation()

  // const [titleError, setTitleError] = useState<string | undefined>()
  // const [contentError, setContentError] = useState<string | undefined>()

  return (
    <>
      <HoliTextInput
        placeholder={t('spaces.input.update.title.placeholder')}
        inputLabel={t('spaces.input.update.title.label')}
        validationErrorText={''}
        value={title}
        onChange={onChangeTitle}
        accessibilityLabel={t('spaces.input.update.title.label')}
        testID="update-title"
      />
      <HoliTextInput
        placeholder={t('spaces.input.update.content.placeholder')}
        inputLabel={t('spaces.input.update.content.label')}
        validationErrorText={''}
        value={content}
        onChange={onChangeContent}
        accessibilityLabel={t('spaces.input.update.content.label')}
        testID="update-content"
        style={{ marginTop: 16 }}
        isRequired={true}
        noOfVisibleLines={5}
        maxNoOfVisibleLines={10}
      />
      <SpaceImageForm
        onUploadImage={onUploadImage}
        image={image}
        instructions={t('spaces.input.update.image.upload.hint')}
      />
    </>
  )
}

export default SpaceUpdateInputForm
