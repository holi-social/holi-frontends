import type React from 'react'
import { useState } from 'react'
import { Image as RNImage } from 'react-native'
import { Image as ExpoImage } from 'expo-image'
import { accessibilityProps } from 'holi-bricks/foundations/accessibility'
import type { ImageProps } from 'holi-bricks/components/image/type'
import { createStyleSheet } from 'holi-bricks/styles'
import { useStyles } from 'holi-bricks/styles'
import { isRemoteSource, setScalingParams } from 'holi-bricks/components/image/helpers'
import { WithLocalSvg } from 'react-native-svg/css'

const isLocalSvg = (source: number) => {
  try {
    const resolvedSource = RNImage.resolveAssetSource(source)
    if (!resolvedSource || !resolvedSource.uri) return false
    const uri = resolvedSource.uri
    return /\.svg(\?|#|$)/i.test(uri)
  } catch {
    return false
  }
}

export const Image: React.FC<ImageProps> = ({
  source,
  width,
  height,
  resizeMode = 'cover',
  onError,
  onLoadEnd,
  stretch,
  fallbackSource,
  blurhash,
  alt,
  aspectRatio,
  ...otherProps
}) => {
  const [hasError, setHasError] = useState(false)
  const { styles } = useStyles(stylesheet)
  const isRemote = isRemoteSource(source)
  const localSvg = typeof source === 'number' && isLocalSvg(source)

  if (!source) return undefined

  if (localSvg) {
    return (
      <WithLocalSvg
        role="img"
        aria-label={alt}
        asset={source}
        width={width}
        height={height}
        accessibilityLabel={alt}
        accessible={otherProps?.['aria-hidden'] === true}
        accessibilityRole={otherProps?.['aria-hidden'] === true ? 'none' : 'image'}
        style={[styles.imageSize(width, height), styles.aspectRatio(aspectRatio), styles.stretch(stretch)]}
        {...accessibilityProps(otherProps)}
      />
    )
  }

  const transformedSource =
    typeof width === 'number' && typeof height === 'number' ? setScalingParams(source, width, height) : undefined
  return (
    <>
      <ExpoImage
        source={(hasError || !transformedSource) && fallbackSource ? fallbackSource : transformedSource}
        alt={alt}
        role="img"
        accessibilityLabel={alt}
        accessibilityRole={otherProps?.['aria-hidden'] === true ? 'none' : 'image'}
        accessible={otherProps?.['aria-hidden'] === true}
        placeholder={isRemote ? blurhash : undefined}
        style={[styles.imageSize(width, height), styles.aspectRatio(aspectRatio), styles.stretch(stretch)]}
        contentFit={resizeMode}
        onError={() => {
          setHasError(true)
          // eslint-disable-next-line no-console
          console.warn(`[Image] Failed to load image: ${source}`)
          if (onError) onError()
        }}
        aria-label={alt}
        onLoadEnd={onLoadEnd}
        {...accessibilityProps(otherProps)}
      />
    </>
  )
}

const stylesheet = createStyleSheet({
  imageSize: (width: number, height: number) => {
    return {
      width,
      height,
    }
  },
  aspectRatio: (n?: string | number) => ({
    aspectRatio: n,
  }),
  stretch: (stretch?: boolean) => {
    if (!stretch) return {}
    return {
      width: '100%',
      height: '100%',
    }
  },
})
