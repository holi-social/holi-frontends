import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, Edit2 } from '@holi/icons/src/generated'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import Spacing from '@holi/ui/foundations/Spacing'

type ImageEditorProps = {
  image?: HoliImageInfo | null
  currentImage?: string // used for edit mode - when we only have a uri and no HoliImageInfo
  onSave: (image: HoliImageInfo | null) => void
}

const ImageEditor = ({ image, currentImage, onSave }: ImageEditorProps) => {
  const { t } = useTranslation()

  return (
    <>
      {(image || currentImage) && (
        <View style={styles.container}>
          {image && (
            <HoliImage label={t('global.imageEditor.image')} source={image} resizeMode="cover" style={styles.image} />
          )}
          {!image && currentImage && (
            <HoliImage
              label={t('global.imageEditor.image')}
              source={{ uri: currentImage }}
              resizeMode="cover"
              style={styles.image}
            />
          )}
          <View style={styles.buttonContainer}>
            <HoliButton label={t('global.delete')} type="secondary" variant="small" inline onPress={() => onSave(null)}>
              <HoliText size="small">{t('global.delete')}</HoliText>
              <HoliIcon icon={Delete} size={16} style={styles.buttonIcon} />
            </HoliButton>
            <HoliImagePicker
              fileSizeLimitation={{
                type: 'resize',
                limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
                resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
              }}
              onPickImage={onSave}
              buttonProps={{
                label: t('global.edit'),
                type: 'secondary',
                variant: 'small',
                inline: true,
              }}
            >
              <HoliText size="small">{t('global.edit')}</HoliText>
              <HoliIcon icon={Edit2} size={16} style={styles.buttonIcon} />
            </HoliImagePicker>
          </View>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  buttonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: Spacing.xxs,
    flexDirection: 'row',
    gap: Spacing['3xs'],
  },
  buttonIcon: {
    marginLeft: Spacing['4xs'],
  },
  image: {
    aspectRatio: 1.5,
    borderRadius: 8,
    width: '100%',
  },
})

export default ImageEditor
