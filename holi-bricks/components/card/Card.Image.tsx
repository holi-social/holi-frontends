import type React from 'react'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import type { MultiPlatformImageSource } from 'holi-bricks/components/image'
import { BorderRadius } from 'holi-bricks/foundations'
import { Image } from 'holi-bricks/components/image'
import { View } from 'react-native'
import { getPlaceholderImage } from 'holi-bricks/components/image/helpers'

/*
  Card image, use it if you want to have a cover image in the card, just pass the url or the require.
  It has a default placeholder image, you can choose to have a random bg color or one of the chosen
*/
export interface CardImageProps extends React.PropsWithChildren {
  testID?: string
  source: MultiPlatformImageSource
  alt: string
}

export const _CardImage = ({ source, alt, testID }: CardImageProps) => {
  const { styles } = useStyles(cardImageStyle)
  return (
    <View testID={testID} style={[styles.imageWrapper, styles.imageBackground(!!source)]}>
      <Image
        resizeMode="fill"
        width={296}
        height={162}
        stretch
        alt={alt}
        source={source}
        fallbackSource={getPlaceholderImage(alt)}
      />
    </View>
  )
}

const cardImageStyle = createStyleSheet((theme) => ({
  imageWrapper: {
    borderRadius: BorderRadius.xs,
    aspectRatio: 1.83,
    overflow: 'hidden',
  },
  imageBackground: (hasSource: boolean) => ({
    backgroundColor: hasSource ? undefined : theme.colors.decorative.yellowDefault,
  }),
}))
_CardImage.displayName = 'CardImage'
