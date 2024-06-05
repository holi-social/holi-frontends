import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { ViewStyle } from 'react-native'

import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { PropsWithSkeleton } from '@holi/ui/components/types'

import { CardContainer, type CardContainerProps } from './CardContainer'
import { ContentContainer } from './ContentContainer'
import { Image, type ImageProps } from './Image'
import { ImageCaption, type ImageCaptionProps } from './ImageCaption'
import { ImageContainer, type ImageContainerProps } from './ImageContainer'
import { BorderRadius } from './utils'

export interface HoliCardProps extends CardContainerProps, ImageContainerProps, Omit<ImageProps, 'borderRadius'> {
  imageBorderRadius?: BorderRadius
  caption?: React.ReactNode
  captionPosition?: ImageCaptionProps['position']
  direction?: 'horizontal' | 'vertical'
}

const HoliCard = ({
  imageUrl,
  imageLabel,
  imageBlurhash,
  imageWidth,
  imageHeight,
  imageAspectRatio = 1.5,
  caption,
  captionPosition: position = 'bottom',
  loading,
  children,
  hasBorder,
  borderColor,
  borderRadius = 16,
  imageBorderRadius = 8,
  direction = 'vertical',
  testID = 'holi-card',
}: PropsWithChildren<PropsWithSkeleton<HoliCardProps>>) => {
  const cardConainerProps = {
    hasBorder,
    borderColor,
    borderRadius,
    testID,
    extraBottomPadding: direction === 'vertical',
    flexDirection: (direction === 'horizontal' ? 'row' : 'column') as ViewStyle['flexDirection'],
  }
  const containerProps = {
    borderRadius: imageBorderRadius,
    testID,
    extraBottomMargin: direction === 'vertical',
    alignItems: (direction === 'horizontal' ? 'flex-start' : undefined) as ViewStyle['alignItems'],
  }
  const imageFlexBasis = direction === 'horizontal' ? imageWidth : undefined
  const imageCaptionProps = { position, testID }

  return (
    <CardContainer {...cardConainerProps}>
      <ImageContainer {...containerProps} flexBasis={imageFlexBasis}>
        {loading ? (
          <HoliSkeleton
            width={imageWidth ?? 0}
            height={imageHeight ?? 0}
            aspectRatio={imageAspectRatio}
            borderRadius={borderRadius}
          />
        ) : (
          <Image
            imageUrl={imageUrl}
            imageLabel={imageLabel}
            imageBlurhash={imageBlurhash}
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            imageAspectRatio={imageAspectRatio}
            testID={testID}
          />
        )}
        {caption && <ImageCaption {...imageCaptionProps}>{caption}</ImageCaption>}
      </ImageContainer>

      <ContentContainer {...containerProps}>{children}</ContentContainer>
    </CardContainer>
  )
}

export default HoliCard
