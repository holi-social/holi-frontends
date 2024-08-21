import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Close, Delete } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import ImageUpload from './ImageUpload'

type EditUploadedImagesProps = {
  images: HoliImageInfo[]
  setImages: (images: HoliImageInfo[]) => void
  currentImages?: string[] // used for edit mode - when we only have a uri and no HoliImageInfo
  aspectRatio?: number
  onActionButtonPress: () => void
}

const EditUploadedImages = ({
  images,
  setImages,
  currentImages,
  aspectRatio,
  onActionButtonPress,
}: EditUploadedImagesProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = createStyles(theme, aspectRatio)

  return (
    <>
      <ScrollView>
        <HoliContainer>
          <View style={styles.wrapper}>
            <View>
              <HoliText size="extralarge">Edit Images</HoliText>
              <View style={{ marginTop: Spacing.md, flexDirection: 'row', gap: Spacing.xs }}>
                <ImageUpload
                  images={images}
                  onSetImages={(newImages) => setImages([...images, ...newImages])}
                  buttonProps={{ transparent: false, label: '', inline: true, type: 'secondary' }}
                >
                  <HoliText>Add Image</HoliText>
                  <HoliIcon icon={Add} style={{ paddingLeft: Spacing['3xs'] }} />
                </ImageUpload>
                {(!!images.length || !!currentImages?.length) && (
                  <HoliButton
                    inline
                    type="secondary"
                    label={t('individuals.post.image.add')}
                    onPress={() => setImages([])}
                  >
                    <HoliText>Remove all</HoliText>
                    <HoliIcon icon={Delete} style={{ paddingLeft: Spacing['3xs'] }} />
                  </HoliButton>
                )}
              </View>
              <View style={{ marginTop: Spacing.xxs }}>
                <HoliText color="gray300" size="small">
                  .jpg or .png file up to 8 MB
                </HoliText>
              </View>
            </View>
            <View style={styles.gridContainer}>
              {images
                .map((image) => image.uri)
                .concat(currentImages || [])
                .map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <View
                      style={{
                        padding: Spacing['3xs'],
                        borderRadius: Spacing.xs,
                        borderWidth: 1,
                        borderColor: theme.colors.foreground10,
                        backgroundColor: theme.colors.white100,
                      }}
                    >
                      <HoliImage
                        label={t('global.imagePreview.image')}
                        source={typeof image === 'string' ? { uri: image } : image}
                        resizeMode="cover"
                        style={styles.image}
                      />
                      <View style={styles.buttonContainer}>
                        <HoliButton
                          transparent
                          label={''}
                          style={styles.button}
                          onPress={() => setImages(images.filter((_, imageIndex) => imageIndex !== index))}
                        >
                          <HoliIcon icon={Delete} size={20} style={styles.icon} />
                        </HoliButton>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </HoliContainer>
      </ScrollView>
      <View
        style={{
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
        }}
      >
        <HoliContainer flexDirection="row" gap={Spacing.xxs}>
          <HoliButton
            label=""
            type="secondary"
            inline
            style={{ paddingHorizontal: 0, width: 55, display: 'flex', justifyContent: 'center' }}
            contentStyle={{ justifyContent: 'center' }}
            onPress={onActionButtonPress}
          >
            <HoliIcon style={{ alignSelf: 'center' }} size={24} icon={Close} />
          </HoliButton>
          <HoliButton inline label={t('individuals.post.input.save')} style={{ flex: 1 }} onPress={onActionButtonPress}>
            <HoliText>Save</HoliText>
          </HoliButton>
        </HoliContainer>
      </View>
    </>
  )
}

const createStyles = (theme: HoliTheme, aspectRatio = 16 / 9) =>
  StyleSheet.create({
    wrapper: {
      paddingBottom: Spacing['4xl'] * 2,
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
    image: {
      aspectRatio: aspectRatio,
      borderRadius: 8,
      width: '100%',
    },
    button: {
      justifyContent: 'center',
      alignContent: 'center',
      borderWidth: 1,
      borderRadius: 84,
      width: 40,
      height: 40,
    },
    buttonContainer: {
      paddingTop: Spacing['3xs'],
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      gap: Spacing.xxs,
      marginLeft: Spacing.xxs,
    },
    icon: {
      alignSelf: 'center',
    },
  })

export default EditUploadedImages
