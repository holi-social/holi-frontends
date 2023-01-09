import * as React from 'react'
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliCardComponentProps = {
  imageUrl: string | undefined
  imageLabel: string
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild>
  style?: StyleProp<ViewStyle>
  testID?: string
  onCardPress: () => void
}

const ImageContainerSkeleton = () => {
  return <View style={styles.imageSkeleton} />
}

const HoliCardComponent: React.VFC<HoliCardComponentProps> = ({
  imageUrl,
  imageLabel,
  children,
  style,
  testID,
  onCardPress,
}: HoliCardComponentProps) => {
  return (
    <Pressable testID={testID} style={[styles.container, style]} onPress={() => onCardPress()}>
      {(imageUrl && (
        <HoliImage testID="cardImage" source={{ uri: imageUrl }} label={imageLabel} style={styles.mainImage} />
      )) || <ImageContainerSkeleton />}
      {children}
    </Pressable>
  )
}

export default HoliCardComponent

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.backgroundColorWhite,
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
    backgroundColor: colors.backgroundColorGreyLight,
  },
})
