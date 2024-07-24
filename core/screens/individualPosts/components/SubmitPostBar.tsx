import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ImageAdd, ImageEdit } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import ImageUpload from './ImageUpload'

export const SubmitPostBar = ({
  onSubmit,
  onSetImage,
  hasSetImage,
  submitting,
  isSubmittable,
  isEdit,
}: {
  onSubmit: () => void
  onSetImage: (image: HoliImageInfo) => void
  hasSetImage: boolean
  submitting: boolean
  isSubmittable: boolean
  isEdit: boolean
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getSubmitPostBarStyles(theme), [theme])

  return (
    <SafeArea style={styles.menuContainer} edges={['bottom']}>
      <View style={styles.items}>
        {/* <HoliImagePicker
          fileSizeLimitation={{
            type: 'resize',
            limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
            resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
          }}
          buttonProps={{
            label: t('individuals.post.image.add'),
            transparent: true,
            inline: true,
          }}
          onPickImage={onSetImage}
        >
          <HoliIcon icon={hasSetImage ? ImageEdit : ImageAdd} style={styles.addImageIcon} />
        </HoliImagePicker> */}
        {/* <ImageUpload /> */}

        <HoliButtonLoading
          label={isEdit ? t('individuals.post.input.save') : t('individuals.post.input.submit')}
          inline
          variant="small"
          onPress={onSubmit}
          style={styles.roundSubmitButton}
          loading={submitting}
          disabled={!isSubmittable || submitting}
        >
          <HoliText bold>{isEdit ? t('individuals.post.input.save') : t('individuals.post.input.submit')}</HoliText>
        </HoliButtonLoading>
      </View>
    </SafeArea>
  )
}
const getSubmitPostBarStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    menuContainer: {
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        web: {
          position: 'absolute',
          bottom: 0,
          width: '100%',
        },
        android: {
          position: 'absolute',
          bottom: 0,
          width: '100%',
        },
      }),
      backgroundColor: theme.colors.background10,
    },
    roundSubmitButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 500,
      borderWidth: 1,
    },
    addImageIcon: {
      paddingLeft: 2,
    },
    items: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: dimensions.breakpointM,
      ...Platform.select({
        ios: {
          padding: 12,
        },
      }),
    },
  })
