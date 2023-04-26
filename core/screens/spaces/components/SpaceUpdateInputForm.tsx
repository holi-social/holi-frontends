import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import { SPACE_POST_VISIBILITY_TYPE_OPTIONS } from '@holi/core/screens/spaces/components/SpaceTask/consts'
import { VisibilityType } from '@holi/core/screens/spaces/types'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect, { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'

export interface SpaceUpdateInputFormProps {
  onChangeVisibility: (_: HoliModalSelectOption) => void
  onChangeTitle: (title: string) => void
  onChangeContent: (title: string) => void
  onUploadImage: (image: ImageInfo | undefined) => void
  visibility?: HoliModalSelectOption
  title: string
  content: string
  image: ImageInfo | undefined
}

const SpaceUpdateInputForm: React.VFC<SpaceUpdateInputFormProps> = ({
  onChangeVisibility,
  onChangeTitle,
  onChangeContent,
  onUploadImage,
  visibility,
  title,
  content,
  image,
}: SpaceUpdateInputFormProps) => {
  const { t } = useTranslation()
  const [visibilityOptions, setVisibilityOptions] = useState<HoliModalSelectOption[]>(
    SPACE_POST_VISIBILITY_TYPE_OPTIONS
  )

  // set options translations
  useEffect(() => {
    setVisibilityOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`spaces.input.update.visibility.${option.id}.title`),
        description: t(`spaces.input.update.visibility.${option.id}.description`),
        selected: option.id === VisibilityType.MEMBERS ? true : false,
      }))
    )
  }, [t, setVisibilityOptions])

  useEffect(() => {
    if (visibility) {
      setVisibilityOptions((options) =>
        options.map((visibilityOption) =>
          visibilityOption.title === visibility.title
            ? { ...visibilityOption, selected: true }
            : { ...visibilityOption, selected: false }
        )
      )
    }
  }, [visibility])

  return (
    <>
      <HoliModalSelect
        options={visibilityOptions}
        style={styles.marginSeparator}
        title={t('spaces.input.update.visibility.label')}
        description={t('spaces.input.update.visibility.description')}
        onChange={onChangeVisibility}
        placeholder={t('spaces.input.task.visibility.placeholder')}
        label={t('spaces.input.update.visibility.label')}
        testID="update-visibility-input"
        isRequired
        showOptionIcon
      />

      <HoliTextInput
        placeholder={t('spaces.input.update.title.placeholder')}
        inputLabel={t('spaces.input.update.title.label')}
        validationErrorText={''}
        value={title}
        onChange={onChangeTitle}
        accessibilityLabel={t('spaces.input.update.title.label')}
        testID="update-title-input"
        style={{ marginTop: 24 }}
        maxNoOfCharacters={128}
      />

      <HoliTextInput
        placeholder={t('spaces.input.update.content.placeholder')}
        inputLabel={t('spaces.input.update.content.label')}
        validationErrorText={''}
        value={content}
        onChange={onChangeContent}
        accessibilityLabel={t('spaces.input.update.content.label')}
        testID="update-content-input"
        style={{ marginTop: 24 }}
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

const styles = StyleSheet.create({
  marginSeparator: {
    marginTop: 16,
  },
})
