import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface CreateSpaceCoverImageProps {
  onUploadImage: (image: HoliImageInfo) => void
  coverImage: HoliImageInfo
}

const CreateSpaceCoverImage: React.FC<CreateSpaceCoverImageProps> = ({
  onUploadImage,
  coverImage,
}: CreateSpaceCoverImageProps) => {
  const { setNextButtonEnabled } = useWizard()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: theme.colors.background10,
    },
  })
