import type React from 'react'
import { useState } from 'react'
import { Image as RNImage } from 'react-native'
import { Image as ExpoImage } from 'expo-image'
import { StyleSheet } from 'react-native-unistyles'
import { WithLocalSvg } from 'react-native-svg/css'

import { accessibilityProps } from 'holi-bricks/foundations/accessibility'
import type { MultiPlatformImage } from 'holi-bricks/components/image/type'
import { isRemoteSource, transformSource } from 'holi-bricks/components/image/helpers'
import { layoutStyle } from 'holi-bricks/foundations'

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

export const Image = ({
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
}: MultiPlatformImage) => {
  const [hasError, setHasError] = useState(false)

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
        accessibilityLabel={alt}
        accessible={otherProps?.['aria-hidden'] === true}
        accessibilityRole={otherProps?.['aria-hidden'] === true ? 'none' : 'image'}
        style={[
          styles.imageSize(width, height),
          styles.aspectRatio(aspectRatio),
          styles.stretch(stretch),
          layoutStyle(otherProps),
        ]}
        {...accessibilityProps(otherProps)}
      />
    )
  }

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
        style={[styles.imageSize(width, height), styles.stretch(stretch), layoutStyle(otherProps)]}
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

const styles = StyleSheet.create({
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
