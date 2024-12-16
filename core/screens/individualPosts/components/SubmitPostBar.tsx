import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import type { FeedPostImage } from '@holi/core/screens/individualPosts/types'
import { ImageAdd, ImageEdit, MapPinLine } from '@holi/icons/src/generated'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button, ButtonIcon } from 'holi-bricks/components/button'

export const SubmitPostBar = ({
  onSubmit,
  showLocationModal,
  showEditImagesModal,
  submitting,
  isSubmittable,
  isEdit,
  images,
  setImages,
  currentImages,
}: {
  onSubmit: () => void
  showLocationModal: () => void
  showEditImagesModal: () => void
  submitting: boolean
  isSubmittable: boolean
  isEdit: boolean
  images: HoliImageInfo[]
  setImages: (images: HoliImageInfo[]) => void
  currentImages?: FeedPostImage[]
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const screenWidth = useWindowDimensions().width
  const styles = useMemo(() => getSubmitPostBarStyles(theme, screenWidth), [theme, screenWidth])

  return (
    <View style={styles.menuContainer}>
      <View style={styles.items}>
        <View style={styles.iconContainer}>
          {[...images, ...(currentImages || [])].length === 0 && (
            <HoliImagePicker // todo: use buttonIcon instead of Button with empty label
              allowsMultipleSelection
              fileSizeLimitation={{
                type: 'resize',
                limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
                resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
              }}
              buttonIconProps={{
                transparent: true,
                label: t('individuals.post.images.add'),
                icon: ImageAdd,
                size: 'lg',
              }}
              buttonIconOnly
              onPickImages={setImages}
            />
          )}
          {[...images, ...(currentImages || [])].length > 0 && (
            <ButtonIcon
              transparent
              onPress={showEditImagesModal}
              label={t('individuals.post.input.location.title')}
              icon={ImageEdit}
              size="lg"
            />
          )}
          <ButtonIcon
            transparent
            onPress={showLocationModal}
            label={t('individuals.post.input.location.title')}
            icon={MapPinLine}
            size="lg"
          />
        </View>

        <Button
          label={isEdit ? t('individuals.post.input.save') : t('individuals.post.input.submit')}
          inline
          size="sm"
          onPress={onSubmit}
          loading={submitting}
          disabled={!isSubmittable || submitting}
        />
      </View>
    </View>
  )
}
const getSubmitPostBarStyles = (theme: HoliTheme, screenWidth: number) =>
  StyleSheet.create({
    menuContainer: {
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background10,
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
        web: {
          paddingHorizontal: screenWidth > dimensions.breakpointM ? Spacing.lg : 0,
        },
      }),
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
  })
