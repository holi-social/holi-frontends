import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import ImagePreview from '@holi/core/screens/individualPosts/components/ImagePreview'
import { type FeedPostImage, ImageAspectRatio } from '@holi/core/screens/individualPosts/types'
import { Add, Close, Delete } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button, ButtonIcon } from 'holi-bricks/components/button'
import { ChipAction } from 'holi-bricks/components/chips/ChipAction'

type EditUploadedImagesProps = {
  images: HoliImageInfo[]
  setImages: (images: HoliImageInfo[]) => void
  currentImages?: FeedPostImage[] // used for edit mode - when we only have a uri and no HoliImageInfo
  setCurrentImages?: (images: FeedPostImage[]) => void
  aspectRatio?: ImageAspectRatio
  onActionButtonPress: () => void
  setAspectRatio: (aspectRatio: ImageAspectRatio) => void
}

const EditUploadedImages = ({
  images,
  setImages,
  setCurrentImages,
  currentImages,
  aspectRatio = ImageAspectRatio.SIXTEEN_NINE,
  onActionButtonPress,
  setAspectRatio,
}: EditUploadedImagesProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = createStyles(theme)

  return (
    <>
      <ScrollView>
        <HoliContainer>
          <View style={styles.wrapper}>
            <View>
              <HoliText size="extralarge">{t('individuals.post.images.edit')}</HoliText>
              <View style={styles.header}>
                <HoliImagePicker
                  allowsMultipleSelection
                  fileSizeLimitation={{
                    type: 'resize',
                    limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
                    resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
                  }}
                  buttonProps={{
                    transparent: false,
                    label: t('individuals.post.images.addImage'),
                    inline: true,
                    variant: 'secondary',
                    icon: Add,
                  }}
                  onPickImages={(newImages) => setImages([...images, ...newImages])}
                />
                {(!!images.length || !!currentImages?.length) && (
                  <Button
                    inline
                    variant="secondary"
                    label={t('individuals.post.images.removeAll')}
                    onPress={() => {
                      setImages([])
                      setCurrentImages?.([])
                    }}
                    icon={Delete}
                  />
                )}
              </View>
              <View style={styles.requirements}>
                <HoliText color="gray300" size="small">
                  {t('individuals.post.images.requirements')}
                </HoliText>
              </View>

              <View style={styles.imageRatioContainer}>
                <HoliText size="large">{t('individuals.post.images.imageRatio')}</HoliText>
                <View style={styles.imageRatioButtons}>
                  <ChipAction
                    onPress={() => setAspectRatio(ImageAspectRatio.SIXTEEN_NINE)}
                    color="white"
                    id={'sixteen-nine'}
                    selected={aspectRatio === ImageAspectRatio.SIXTEEN_NINE}
                  >
                    16:9
                  </ChipAction>
                  <ChipAction
                    onPress={() => setAspectRatio(ImageAspectRatio.ONE_ONE)}
                    color="white"
                    id={'one-one'}
                    selected={aspectRatio === ImageAspectRatio.ONE_ONE}
                  >
                    1:1
                  </ChipAction>
                </View>
              </View>
            </View>
            <View style={styles.gridContainer}>
              {[...(currentImages || []), ...images].map((image, index) => {
                // differentiate types between FeedPostImage and HoliImageInfo
                const imageInfo = (image as FeedPostImage)?.id ? undefined : (image as HoliImageInfo)
                const feedPostImage = imageInfo ? undefined : (image as FeedPostImage)
                return (
                  <View key={index} style={styles.imageContainer}>
                    <View style={styles.imageWrapper}>
                      <ImagePreview
                        key={index}
                        image={imageInfo}
                        currentImage={feedPostImage?.image}
                        aspectRatio={aspectRatio === ImageAspectRatio.SIXTEEN_NINE ? 16 / 9 : 1 / 1}
                      />
                      <View style={styles.buttonContainer}>
                        <ButtonIcon
                          variant="secondary"
                          label={t('individuals.post.images.remove')}
                          onPress={() => {
                            if (imageInfo) {
                              setImages(
                                images.filter((_, imageIndex) => imageIndex !== index - (currentImages?.length || 0))
                              )
                            }
                            if (feedPostImage) {
                              setCurrentImages?.(
                                (currentImages || []).filter((_, imageIndex) => imageIndex !== index - images.length)
                              )
                            }
                          }}
                          icon={Delete}
                        />
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        </HoliContainer>
      </ScrollView>
      <View style={styles.footer}>
        <HoliContainer flexDirection="row" gap={Spacing.xxs}>
          <ButtonIcon
            label={t('global.back')}
            variant="secondary"
            onPress={onActionButtonPress}
            icon={Close}
            size="lg"
          />
          <View style={styles.saveButton}>
            <Button inline label={t('individuals.post.input.save')} size="lg" onPress={onActionButtonPress} />
          </View>
        </HoliContainer>
      </View>
    </>
  )
}

const createStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      paddingBottom: Spacing['4xl'] * 2,
    },
    header: {
      marginTop: Spacing.md,
      flexDirection: 'row',
      gap: Spacing.xs,
    },
    buttonIcon: {
      paddingLeft: Spacing['3xs'],
    },
    requirements: {
      marginTop: Spacing['3xs'],
    },
    imageRatioContainer: {
      marginTop: Spacing.sm,
    },
    imageRatioButtons: {
      flexDirection: 'row',
      gap: Spacing['3xs'],
      marginTop: Spacing['3xs'],
    },
    imageRatioButton: {
      width: 70,
      borderRadius: 100,
      backgroundColor: theme.colors.background10,
    },
    imageRatioButtonActive: {
      backgroundColor: theme.colors.foreground30,
      color: theme.colors.background10,
    },
    container: {
      position: 'relative',
    },
    gridContainer: {
      marginVertical: Spacing.sm,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between', // Ensures that the gap is consistent
      marginHorizontal: -Spacing['4xs'],
    },
    imageContainer: {
      width: '50%',
      padding: Spacing['4xs'],
    },
    imageWrapper: {
      padding: Spacing['3xs'],
      borderRadius: Spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      backgroundColor: theme.colors.white100,
    },
    buttonContainer: {
      paddingTop: Spacing['3xs'],
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      gap: Spacing.xxs,
      marginLeft: Spacing.xxs,
    },
    footer: {
      ...Platform.select({
        web: {
          position: 'fixed',
          bottom: Spacing.xl,
        },
        native: {
          position: 'absolute',
          bottom: Spacing.xl,
        },
      }),
      left: 0,
      right: 0,
    },
    saveButton: {
      flex: 1,
    },
  })

export default EditUploadedImages
