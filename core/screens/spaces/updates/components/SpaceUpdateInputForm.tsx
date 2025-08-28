import type React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native-unistyles'

import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import { SPACE_POST_VISIBILITY_TYPE_OPTIONS } from '@holi/core/screens/spaces/tasks/consts'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect, { type HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { VisibilityType } from '@holi/api/graphql/graphql-codegen'

export interface SpaceUpdateInputFormProps {
  onChangeVisibility: (_: VisibilityType) => void
  onChangeTitle: (title: string) => void
  onChangeContent: (title: string) => void
  onUploadImage: (image: HoliImageInfo | null) => void
  visibility?: VisibilityType
  title: string
  content: string
  image: HoliImageInfo | undefined | null // null is to remove the image
  blurhash?: string
  isAdmin?: boolean
  currentImageUri?: string
}

const SpaceUpdateInputForm: React.FC<SpaceUpdateInputFormProps> = ({
  onChangeVisibility,
  onChangeTitle,
  onChangeContent,
  onUploadImage,
  visibility,
  title,
  content,
  image,
  blurhash,
  isAdmin,
  currentImageUri,
}) => {
  const { t } = useTranslation()
  const [visibilityOptions, setVisibilityOptions] = useState<HoliModalSelectOption<VisibilityType>[]>(
    SPACE_POST_VISIBILITY_TYPE_OPTIONS
  )
  const { show, hide, visible } = useModalState()

  // set options translations
  useEffect(() => {
    setVisibilityOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`spaces.input.update.visibility.${option.id}.title`),
        description: t(`spaces.input.update.visibility.${option.id}.description`),
        selected: option.id === VisibilityType.Members ? true : false,
        disabled: !isAdmin && option.id === VisibilityType.Public ? true : false,
      }))
    )
  }, [t, setVisibilityOptions, isAdmin])

  useEffect(() => {
    if (visibility) {
      setVisibilityOptions((options) =>
        options.map((visibilityOption) =>
          visibilityOption.id === visibility
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
        onChange={(option) => onChangeVisibility(option.id)}
        placeholder={t('spaces.input.task.visibility.placeholder')}
        label={t('spaces.input.update.visibility.label')}
        testID="update-visibility-input"
        isRequired
        showOptionIcon
        show={show}
        hide={hide}
        visible={visible}
      />

      <HoliTextInput
        placeholder={t('spaces.input.update.title.placeholder')}
        inputLabel={t('spaces.input.update.title.label')}
        validationErrorText={''}
        value={title}
        onChange={onChangeTitle}
        aria-label={t('spaces.input.update.title.label')}
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
        aria-label={t('spaces.input.update.content.label')}
        testID="update-content-input"
        style={{ marginTop: 24 }}
        isRequired={true}
        noOfVisibleLines={5}
        maxNoOfVisibleLines={10}
      />

      <SpaceImageForm
        onUploadImage={onUploadImage}
        image={image}
        blurhash={blurhash}
        currentImageUri={currentImageUri}
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
