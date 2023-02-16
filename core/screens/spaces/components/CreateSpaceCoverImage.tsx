import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import SpaceImageForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceImageForm'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface CreateSpaceCoverImageProps {
  onUploadImage: (image: ImageInfo | undefined) => void
  coverImage: ImageInfo | undefined
}

const CreateSpaceCoverImage: React.VFC<CreateSpaceCoverImageProps> = ({
  onUploadImage,
  coverImage,
}: CreateSpaceCoverImageProps) => {
  const { setNextButtonEnabled } = useWizard()
  const mixins = useStyleMixins()
  const { width: deviceWidth } = useWindowDimensions()
  const { t } = useTranslation()
  const onScreenScroll = useScrollYHandler()

  useEffect(() => {
    if (coverImage) {
      setNextButtonEnabled(true)
    } else {
      setNextButtonEnabled(false)
    }
  }, [coverImage, setNextButtonEnabled])

  return (
    <View style={styles.wrapper}>
      <DefaultLayout
        headerOverlap={true}
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={[styles.contentStyle, { width: Platform.OS === 'web' ? deviceWidth : '100%' }]}
      >
        <SpaceImageForm
          title={t('spaces.create.space.stepThree.title')}
          description={t('spaces.create.space.stepThree.subTitle')}
          onUploadImage={onUploadImage}
          image={coverImage}
          style={mixins.container}
        />
      </DefaultLayout>
    </View>
  )
}

export default CreateSpaceCoverImage

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.background10,
  },
  contentStyle: {
    width: '100%',
    backgroundColor: colors.background10,
  },
})
