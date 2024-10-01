import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import { FeedPostImage } from '@holi/core/screens/individualPosts/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ImageAdd, ImageEdit, MapPinLine } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
            <HoliImagePicker
              allowsMultipleSelection
              fileSizeLimitation={{
                type: 'resize',
                limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
                resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
              }}
              buttonProps={{ transparent: true, inline: true, label: t('individuals.post.images.add') }}
              onPickImages={setImages}
            >
              <HoliIcon icon={ImageAdd} style={styles.addImageIcon} />
            </HoliImagePicker>
          )}
          {[...images, ...(currentImages || [])].length > 0 && (
            <HoliButton
              transparent
              inline
              onPress={showEditImagesModal}
              label={t('individuals.post.input.location.title')}
            >
              <HoliIcon icon={ImageEdit} size={28} />
            </HoliButton>
          )}
          <HoliButton transparent inline onPress={showLocationModal} label={t('individuals.post.input.location.title')}>
            <HoliIcon icon={MapPinLine} size={28} />
          </HoliButton>
        </View>

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
