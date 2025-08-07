import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type StyleProp, StyleSheet, type ViewStyle } from 'react-native'

import { getSizes, getTransformedImageUri, useContainerSizeForImage } from '@holi/core/helpers'
import ImagePanZoom from '@holi/core/screens/posts/components/ImagePanZoom'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalFullscreen from '@holi/ui/components/molecules/HoliModalFullscreen'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { breakpoints } from 'holi-bricks/foundations'

interface Props {
  style?: StyleProp<ViewStyle>
  uri: string
  imageBlurhash?: string
  height: number
  width: number
  postTitle: string
}

const POST_IMAGE_SIZES: { breakpoint: number; width: number }[] = [
  {
    breakpoint: breakpoints.xs,
    width: breakpoints.xs - 40,
  },
  {
    breakpoint: breakpoints.sm,
    width: breakpoints.sm - 40,
  },
  {
    breakpoint: breakpoints.md,
    width: breakpoints.md - 40,
  },
  {
    breakpoint: breakpoints.lg,
    width: breakpoints.lg / 2 - 12,
  },
  {
    breakpoint: breakpoints.xl,
    width: breakpoints.xl / 2 - 12,
  },
]

const PostImage: React.FC<PropsWithSkeleton<Props>> = ({ loading, uri, imageBlurhash, width, height, postTitle }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [fullscreenImageModalShown, setFullscreenImageModalShown] = useState(false)
  const imageSrcSet = POST_IMAGE_SIZES.map((transformSize) =>
    getTransformedImageUri({
      imageUri: uri ?? '',
      imageSize: { width: width ?? 0, height: height ?? 0 },
      transformSize,
      aspectRatio: '343-236',
    })
  )
  const imageSizes = getSizes(POST_IMAGE_SIZES)
  const { uri: mobileImageUri, onLayout } = useContainerSizeForImage(uri ?? '', true)

  const showImageFullScreen = useCallback(() => {
    setFullscreenImageModalShown(true)
  }, [setFullscreenImageModalShown])

  const hideFullscreenImage = useCallback(() => {
    setFullscreenImageModalShown(false)
  }, [setFullscreenImageModalShown])

  if (loading) return <HoliSkeleton aspectRatio={343 / 236} borderRadius={16} height={'auto'} width={'100%'} />

  return (
    <>
      <HoliButton
        label={t('insights.posts.image.show', { title: postTitle })}
        inline
        transparent
        onPress={showImageFullScreen}
        testID="post-image"
      >
        <HoliImage
          source={Platform.OS === 'web' ? imageSrcSet : { uri: mobileImageUri }}
          blurhash={imageBlurhash}
          sizes={imageSizes}
          label={t('insights.posts.image', { title: postTitle })}
          style={styles.postImage}
          onLayout={onLayout}
        />
      </HoliButton>

      <HoliModalFullscreen
        label={t('insights.posts.image.modal', { title: postTitle })}
        shown={fullscreenImageModalShown}
        onDismiss={hideFullscreenImage}
        testID="post-image-modal"
      >
        <ImagePanZoom uri={uri} postTitle={postTitle} blurhash={imageBlurhash} />
      </HoliModalFullscreen>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    postImage: {
      aspectRatio: 343 / 236,
      backgroundColor: theme.colors.background30,
      marginTop: 26,
      width: '100%',
    },
    webModalImageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    webModalImage: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  })

export default PostImage
