import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type SpaceCoverImageFormProps = {
  title: string
  onUploadImage: (image: ImageInfo | undefined) => void
  coverImage: ImageInfo | undefined
  style?: ViewStyle
}

const SpaceCoverImageForm: React.VFC<SpaceCoverImageFormProps> = ({
  title,
  onUploadImage,
  coverImage,
  style,
}: SpaceCoverImageFormProps) => {
  const { width: deviceWidth } = useWindowDimensions()
  const { t } = useTranslation()
  const containerPadding = deviceWidth > parseInt(vars.breakpointXl, 10) ? 0 : 20

  const removeImage = () => {
    onUploadImage(undefined)
  }

  const CoverImageUploader = () => {
    return (
      <HoliTabs
        id="upload-image-tabs"
        style={styles.holiTabs}
        tabBarStyle={styles.tabBar}
        tabBarWidth={deviceWidth - containerPadding * 2}
        tabs={[
          {
            title: t('spaces.create.space.stepThree.upload.tab.title'),
            style: { ...styles.tabStyle, width: Platform.OS === 'web' ? '100%' : deviceWidth - containerPadding * 2 },
            children: <ImageUploader />,
          },
        ]}
      />
    )
  }

  const ImageUploader = () => {
    return (
      <View style={styles.imageUploader}>
        {(coverImage && (
          <>
            <View style={styles.imageContainer}>
              <HoliImage
                source={{ uri: coverImage?.uri ?? '' }}
                label={t('spaces.create.space.stepThree.coverImage.label')}
                style={styles.spaceCoverImage}
              />
            </View>
            <View style={styles.uploadButtonContainer}>
              <HoliButton
                label={t('spaces.create.space.stepThree.remove.button.label')}
                onPress={removeImage}
                testID="create-space-remove-image-btn"
                style={styles.imageUploadButton}
              >
                <HoliText>{t('spaces.create.space.stepThree.remove.button.label')}</HoliText>
              </HoliButton>
            </View>
          </>
        )) || (
          <HoliImagePicker
            maxFileSizeInMB={8}
            buttonProps={{
              label: t('spaces.create.space.stepThree.upload.button.label'),
              transparent: true,
              inline: true,
            }}
            onPickImage={onUploadImage}
          >
            <View style={styles.uploadButtonContainer}>
              <HoliButton
                label={t('spaces.create.space.stepThree.upload.button.label')}
                testID="create-space-upload-image-btn"
                style={styles.imageUploadButton}
              >
                <HoliText>{t('spaces.create.space.stepThree.upload.button.label')}</HoliText>
              </HoliButton>
            </View>
          </HoliImagePicker>
        )}
        <Instructions />
      </View>
    )
  }

  const Instructions = () => {
    return (
      <View style={styles.instructionsContainer}>
        <HoliText size="extrasmall" style={styles.instructions}>
          {t('spaces.create.space.stepThree.uploadImage.hint')}
        </HoliText>
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      <HoliText size="extralarge" style={styles.title}>
        {title}
      </HoliText>
      <HoliText style={styles.subTitle}>{t('spaces.create.space.stepThree.subTitle')}</HoliText>
      <CoverImageUploader />
    </View>
  )
}

export default SpaceCoverImageForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 132,
    paddingHorizontal: 0,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  title: {
    marginBottom: 24,
    marginTop: 40,
  },
  subTitle: {
    marginBottom: 50,
    marginTop: 16,
    width: '100%',
    color: colors.foreground20,
  },
  imageUploadButton: {
    backgroundColor: colors.background10,
  },
  instructionsContainer: {
    marginTop: 8,
    justifyContent: 'center',
  },
  instructions: {
    justifyContent: 'center',
    textAlign: 'center',
    color: colors.foreground20,
  },
  holiTabs: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  imageUploadContainer: {
    marginBottom: 4,
    marginHorizontal: 2,
    paddingTop: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingBottom: 0,
  },
  tabStyle: {
    backgroundColor: colors.background10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  imageContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  spaceCoverImage: {
    aspectRatio: 1.5,
    width: '100%',
    borderRadius: 8,
  },
  imageUploader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    paddingLeft: 24,
  },
})
