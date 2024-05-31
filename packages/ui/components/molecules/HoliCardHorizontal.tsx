import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { PropsWithSkeleton } from '@holi/ui/components/types'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface Props {
  imageUrl: string | undefined
  imageLabel: string
  imageBlurhash?: string
  text: string
  testID?: string
}

const IMAGE_HEIGHT = 24
const IMAGE_WIDTH = 24
const IMAGE_BORDER_RADIUS = 4

const HoliCardHorizontal = ({
  loading,
  imageUrl,
  imageLabel,
  imageBlurhash,
  text,
  testID,
}: PropsWithSkeleton<Props>) => {
  const { theme } = useTheme()
  const styles = React.useMemo(() => getStyles(theme), [theme])

  return (
    <View testID={testID} style={StyleSheet.flatten(styles.container)}>
      {!loading && imageUrl ? (
        <View style={styles.imageContainer}>
          <HoliImage
            testID={`${testID}-cardImage`}
            source={{ uri: imageUrl, width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
            blurhash={imageBlurhash}
            label={imageLabel ?? ''}
            style={StyleSheet.flatten(styles.image)}
          />
        </View>
      ) : (
        <HoliSkeleton height={IMAGE_HEIGHT} width={IMAGE_WIDTH} borderRadius={IMAGE_BORDER_RADIUS} />
      )}
      <HoliGap size="xxs" direction="horizontal" />

      <HoliText
        loading={loading}
        size="extrasmall"
        color="gray300"
        numberOfLines={1}
        style={{ flexGrow: 1, width: loading ? 160 : 'auto' }}
      >
        {text}
      </HoliText>
    </View>
  )
}

export default HoliCardHorizontal

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background10,
      borderRadius: 6,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
    },
    imageContainer: {
      flexGrow: 0,
      flexShrink: 0,
      height: IMAGE_HEIGHT,
      width: IMAGE_WIDTH,
    },
    image: {
      borderRadius: IMAGE_BORDER_RADIUS,
      flex: 1,
      width: '100%',
    },
    imageSkeleton: {
      borderRadius: IMAGE_BORDER_RADIUS,
      height: IMAGE_HEIGHT,
      width: IMAGE_WIDTH,
      backgroundColor: theme.colors.background30,
    },
  })
