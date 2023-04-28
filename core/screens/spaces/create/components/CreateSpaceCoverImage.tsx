import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors } from '@holi/ui/styles/globalVars'

interface CreateSpaceCoverImageProps {
  onUploadImage: (image: ImageInfo | undefined) => void
  coverImage: ImageInfo | undefined
}

const CreateSpaceCoverImage: React.VFC<CreateSpaceCoverImageProps> = ({
  onUploadImage,
  coverImage,
}: CreateSpaceCoverImageProps) => {
  const { setNextButtonEnabled } = useWizard()
  const { t } = useTranslation()

  useEffect(() => {
    if (coverImage) {
      setNextButtonEnabled(true)
    } else {
      setNextButtonEnabled(false)
    }
  }, [coverImage, setNextButtonEnabled])

  return (
    <View style={styles.wrapper}>
      <SpaceImageForm
        title={t('spaces.create.stepThree.title')}
        description={t('spaces.input.coverImage.remove.description')}
        onUploadImage={onUploadImage}
        image={coverImage}
      />
    </View>
  )
}

export default CreateSpaceCoverImage

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background10,
  },
})
