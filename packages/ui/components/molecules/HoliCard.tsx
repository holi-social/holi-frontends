import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface HoliCardProps {
  imageUrl: string | undefined
  imageLabel: string
  imageWidth: number
  imageBlurhash?: string
  imageHeight?: number
  testID?: string
  imageAspectRatio?: CardAspectRatio
  hasBorder?: boolean
}

type CardAspectRatio = 1 | 1.5 | 1.75

const generateVariantStyles = (aspectRatio: CardAspectRatio, hasBorder: boolean) => {
  return StyleSheet.create({
    container: {
      ...(hasBorder ? { borderWidth: 1, borderStyle: 'solid', borderColor: colors.gray200 } : {}),
    },
    image: {
      aspectRatio,
    },
  })
}

const HoliCard = ({
  imageUrl,
  imageLabel,
  imageBlurhash,
  imageWidth,
  imageHeight,
  children,
  testID,
  hasBorder,
  imageAspectRatio = 1.5,
}: PropsWithChildren<HoliCardProps>) => {
  const { theme } = useTheme()
  const styles = React.useMemo(() => getStyles(theme), [theme])
  const variantStyles = generateVariantStyles(imageAspectRatio, !!hasBorder)

  return (
    <View testID={testID} style={StyleSheet.flatten([styles.container, variantStyles.container])}>
      {imageUrl ? (
        <HoliImage
          testID={`${testID}-cardImage`}
          source={{ uri: imageUrl, width: imageWidth, height: imageHeight }}
          blurhash={imageBlurhash}
          label={imageLabel}
          style={StyleSheet.flatten([styles.image, variantStyles.image])}
        />
      ) : (
        <View style={styles.imageSkeleton} />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  )
}

export default HoliCard

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      flex: 1,
      height: '100%',
      padding: 8,
      paddingBottom: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.background10,
    },
    image: {
      flex: 1,
      width: '100%',
      borderRadius: 8,
      marginBottom: 16,
    },
    imageSkeleton: {
      borderRadius: 8,
      marginBottom: 8,
      width: '100%',
      height: 200,
      backgroundColor: theme.colors.background30,
    },
    content: {
      paddingHorizontal: 8,
    },
  })
