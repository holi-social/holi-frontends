import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ImageAdd, ImageEdit, MapPinLine } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import ImageUpload from './ImageUpload'

export const SubmitPostBar = ({
  onSubmit,
  showLocationModal,
  showEditImagesModal,
  submitting,
  isSubmittable,
  isEdit,
  images,
  setImages,
}: {
  onSubmit: () => void
  showLocationModal: () => void
  showEditImagesModal: () => void
  submitting: boolean
  isSubmittable: boolean
  isEdit: boolean
  images: HoliImageInfo[]
  setImages: (images: HoliImageInfo[]) => void
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getSubmitPostBarStyles(theme), [theme])

  return (
    <SafeArea style={styles.menuContainer} edges={['bottom']}>
      <View style={styles.items}>
        <View style={styles.iconContainer}>
          {images.length === 0 && (
            <ImageUpload images={images} onSetImages={setImages}>
              <HoliIcon icon={ImageAdd} style={styles.addImageIcon} />
            </ImageUpload>
          )}
          {images.length > 0 && (
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
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
  })
