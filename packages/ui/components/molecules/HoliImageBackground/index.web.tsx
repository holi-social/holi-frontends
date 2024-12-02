import type React from 'react'
import { forwardRef } from 'react'
import { type ImageBackgroundProps, StyleSheet, View } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage/index.web'
import type { WebImageProps } from '@holi/ui/components/atoms/HoliImage/types'

const emptyStyle = { height: undefined, width: undefined }

type HoliImageBackgroundProps = Omit<ImageBackgroundProps, 'source' | 'resizeMode' | 'onError'> &
  Pick<WebImageProps, 'source' | 'resizeMode' | 'onError' | 'label'>

/**
 * Copy from https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/ImageBackground/index.js
 * using our own HoliImage instead of the react-native-web Image component
 * to allow SSR
 */
export const HoliImageBackground = forwardRef<View, HoliImageBackgroundProps>(
  (props: HoliImageBackgroundProps, forwardedRef) => {
    const { children, style = emptyStyle, imageStyle, ...rest } = props
    const { height, width } = StyleSheet.flatten(style)
    const imageStyleFlattened = StyleSheet.flatten([
      {
        // Temporary Workaround:
        // Current (imperfect yet) implementation of <Image> overwrites width and height styles
        // (which is not quite correct), and these styles conflict with explicitly set styles
        // of <ImageBackground> and with our internal layout model here.
        // So, we have to proxy/reapply these styles explicitly for actual <Image> component.
        // This workaround should be removed after implementing proper support of
        // intrinsic content size of the <Image>.
        width,
        height,
        zIndex: -1,
      },
      StyleSheet.absoluteFill,
      imageStyle,
    ])

    return (
      <View ref={forwardedRef} style={style}>
        <HoliImage {...rest} style={imageStyleFlattened as React.CSSProperties} />
        {children}
      </View>
    )
  }
)

HoliImageBackground.displayName = 'HoliImageBackground'
