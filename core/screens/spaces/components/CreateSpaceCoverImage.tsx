import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CreateSpaceCoverImageProps = {
  onUploadImage: (image: ImageInfo | undefined) => void
  coverImage: ImageInfo | undefined
}

const CreateSpaceCoverImage: React.VFC<CreateSpaceCoverImageProps> = ({
  onUploadImage,
  coverImage,
}: CreateSpaceCoverImageProps) => {
  const { setNextButtonEnabled } = useWizard()
  const mixins = useStyleMixins()
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()
  const { t } = useTranslation()
  const onScreenScroll = useScrollYHandler()
  const containerPadding = deviceWidth > parseInt(vars.breakpointXl, 10) ? 0 : 20

  const removeImage = () => {
    onUploadImage(undefined)
  }

  useEffect(() => {
    if (coverImage) {
      setNextButtonEnabled(true)
    } else {
      setNextButtonEnabled(false)
    }
  }, [coverImage, setNextButtonEnabled])

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
            children: (
              <DefaultLayout
                onScroll={onScreenScroll}
                scrollEventThrottle={200}
                style={styles.imageUploadContainer}
                headerOverlap={true}
              >
                <ImageUploader />
              </DefaultLayout>
            ),
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
            buttonProps={{
              label: t('spaces.create.space.stepThree.upload.button.label'),
              transparent: true,
              inline: true,
            }}
            onPickImage={onUploadImage}
            maxFileSizeInMB={8}
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
    <View style={styles.wrapper}>
      <DefaultLayout
        headerOverlap={true}
        scrollEnabled={false}
        style={[styles.contentStyle, { width: Platform.OS === 'web' ? deviceWidth : '100%' }]}
      >
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <HoliText size="extralarge" style={styles.title}>
            {t('spaces.create.space.stepThree.title')}
          </HoliText>
          <HoliText style={styles.subTitle}>{t('spaces.create.space.stepThree.subTitle')}</HoliText>
          <CoverImageUploader />
        </View>
      </DefaultLayout>
    </View>
  )
}

export default CreateSpaceCoverImage

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
    alignItems: 'center',
    display: 'flex',
    backgroundColor: colors.background10,
  },
  contentStyle: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background10,
    ...Platform.select({
      web: {
        minHeight: '100vh',
        paddingHorizontal: 24,
      },
    }),
  },
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
