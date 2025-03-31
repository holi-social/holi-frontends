import type React from 'react'
import { useState } from 'react'
import { Image as RNImage, View } from 'react-native'
import { Image as ExpoImage } from 'expo-image'
//import { WithLocalSvg } from 'react-native-svg/css'
import { accessibilityProps } from 'holi-bricks/accessibility'
import type { ImageProps } from 'holi-bricks/components/image/type'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import { isRemoteSource, setScalingParams } from 'holi-bricks/components/image/helpers'

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
  fallbackSource,
  blurhash,
  alt,
  whiteOverlay: overlay,
  ...otherProps
}) => {
  const [hasError, setHasError] = useState(false)
  const transformedSource = setScalingParams(source, width, height)
  const isRemote = isRemoteSource(source)
  const localSvg = typeof source === 'number' && isLocalSvg(source)
  const { styles } = useStyles(stylesheet)

  if (!source) return null

  if (localSvg) {
    const { WithLocalSvg } = require('react-native-svg/css')
    return (
      <WithLocalSvg
        role="img"
        aria-label={alt}
        asset={source}
        width={width}
        accessibilityLabel={alt}
        accessible={otherProps?.['aria-hidden'] === true}
        accessibilityRole={otherProps?.['aria-hidden'] === true ? 'none' : 'image'}
        height={height}
        {...accessibilityProps(otherProps)}
      />
    )
  }

  return (
    <>
      <ExpoImage
        source={hasError && fallbackSource ? fallbackSource : transformedSource}
        alt={alt}
        role="img"
        accessibilityLabel={alt}
        accessibilityRole={otherProps?.['aria-hidden'] === true ? 'none' : 'image'}
        accessible={otherProps?.['aria-hidden'] === true}
        placeholder={isRemote ? blurhash : undefined}
        style={[{ width, height }]}
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
      {overlay && <View style={styles.overlay} />}
    </>
  )
}

const stylesheet = createStyleSheet({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
})
