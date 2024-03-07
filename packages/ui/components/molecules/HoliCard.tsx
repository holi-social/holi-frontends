import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliCardProps {
  imageUrl: string | undefined
  imageLabel: string
  imageBlurhash?: string
  imageWidth: number
  style?: StyleProp<ViewStyle>
  testID?: string
}

const ImageContainerSkeleton = () => {
  return <View style={styles.imageSkeleton} />
}

const HoliCard = ({
  imageUrl,
  imageLabel,
  imageBlurhash,
  imageWidth,
  children,
  style,
  testID,
}: PropsWithChildren<HoliCardProps>) => {
  return (
    <View testID={testID} style={[styles.container, style]}>
      {imageUrl ? (
        <HoliImage
          testID={`${testID}-cardImage`}
          source={{ uri: imageUrl, width: imageWidth }}
          blurhash={imageBlurhash}
          label={imageLabel}
          style={styles.mainImage}
        />
      ) : (
        <ImageContainerSkeleton />
      )}
      {children}
    </View>
  )
}

export default HoliCard

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.background10,
  },
  mainImage: {
    aspectRatio: 1.5,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  imageSkeleton: {
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
    height: 200,
    backgroundColor: colors.background30,
  },
})
