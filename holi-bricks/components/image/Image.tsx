import type React from 'react'
import { useState } from 'react'
import { Image as RNImage } from 'react-native'
import { Image as ExpoImage } from 'expo-image'
import { accessibilityProps } from 'holi-bricks/foundations/accessibility'
import type { MultiPlatformImage } from 'holi-bricks/components/image/type'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { isRemoteSource, transformSource } from 'holi-bricks/components/image/helpers'
import { WithLocalSvg } from 'react-native-svg/css'
import { layoutStyle } from 'holi-bricks/foundations'
import { imageStretching } from 'holi-bricks/components/image/styles'

const isLocalSvg = (source: number) => {
  try {
    const resolvedSource = RNImage.resolveAssetSource(source)
    if (!resolvedSource || !resolvedSource.uri) return false
    const uri = resolvedSource.uri
    return /\.svg(\?|#|$|&)/i.test(uri)
  } catch {
    return false
  }
}

const getSVGPreserveAspectRatio = (resizeMode: MultiPlatformImage['resizeMode']) => {
  switch (resizeMode) {
    case 'cover':
      return 'xMidYMid slice'
    case 'contain':
      return 'xMidYMid meet'
    case 'fill':
      return 'none'
    default:
      return 'xMidYMid meet'
  }
}

export const Image: React.FC<MultiPlatformImage> = ({
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

  if (!source) return undefined

  const isRemote = isRemoteSource(source)
  const localSvg = typeof source === 'number' && isLocalSvg(source)
  const transformedSource =
    typeof width === 'number' && typeof height === 'number' ? transformSource(source, width, height) : undefined

  if (localSvg) {
    return (
      <WithLocalSvg
        role="img"
        aria-label={alt}
        asset={source}
        width={stretch ? '100%' : width}
        height={stretch ? '100%' : height}
        preserveAspectRatio={getSVGPreserveAspectRatio(resizeMode)}
        style={[styles.imageSize(width, height), styles.imageStretching(stretch, aspectRatio), layoutStyle(otherProps)]}
        {...accessibilityProps(otherProps)}
      />
    )
  }

  return (
    <ExpoImage
      source={(hasError || !transformedSource) && fallbackSource ? fallbackSource : transformedSource}
      alt={alt}
      placeholder={isRemote ? blurhash : undefined}
      style={[styles.imageSize(width, height), styles.imageStretching(stretch, aspectRatio), layoutStyle(otherProps)]}
      contentFit={resizeMode}
      onError={() => {
        setHasError(true)
        // eslint-disable-next-line no-console
        console.warn(`[Image] Failed to load image: ${source}`)
        if (onError) onError()
      }}
      role="img"
      aria-label={alt}
      onLoadEnd={onLoadEnd}
      {...accessibilityProps(otherProps)}
    />
  )
}

export const stylesheet = createStyleSheet({
  imageSize: (width: number, height: number) => ({
    width,
    height,
    maxWidth: '100%',
  }),
  imageStretching,
})
