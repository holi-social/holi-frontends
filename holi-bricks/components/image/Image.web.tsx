import type { ImageProps } from 'holi-bricks/components/image'
import type React from 'react'
import { useState } from 'react'
import NextImage from 'next/image'
import { accessibilityProps } from 'holi-bricks/accessibility'
import { setScalingParams } from 'holi-bricks/components/image/helpers'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import { View } from 'react-native'

export const isRemoteSource = (source: string): source is string => {
  return /^(https?:)?\/\//i.test(source)
}

export const Image: React.FC<ImageProps> = ({
  source,
  alt,
  width,
  height,
  resizeMode = 'cover',
  onError,
  onLoadEnd,
  fallbackSource,
  blurhash,
  whiteOverlay: overlay,
  ...otherProps
}) => {
  const [hasError, setHasError] = useState(false)
  const isRemote = isRemoteSource(source as string)
  const transformedSource = (isRemote ? setScalingParams(source as string, width, height) : source) as string
  const { styles } = useStyles(stylesheet)

  return (
    <>
      <NextImage
        src={hasError && fallbackSource ? (fallbackSource as string) : transformedSource}
        alt={alt}
        role="img"
        aria-label={alt}
        blurDataURL={isRemote ? blurhash : undefined}
        width={width}
        height={height}
        style={{ objectFit: resizeMode }}
        onError={() => {
          setHasError(true)
          // eslint-disable-next-line no-console
          console.warn(`[Image] Failed to load image: ${transformedSource}`)
          if (onError) onError()
        }}
        onLoad={onLoadEnd}
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
