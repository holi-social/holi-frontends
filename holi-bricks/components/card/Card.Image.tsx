import type React from 'react'
import { useMemo } from 'react'
import { useStyles } from 'holi-bricks/hooks'
import type { MultiPlatformImageSource } from 'holi-bricks/components/image'
import { BorderRadius } from 'holi-bricks/tokens'
import { Image } from 'holi-bricks/components/image'
import { View } from 'react-native'
import { createStyleSheet } from 'holi-bricks/utils'

/*
  Card image, use it if you want to have a cover image in the card, just pass the url or the require.
  It has a default placeholder image, you can choose to have a random bg color or one of the chosen
*/
export interface CardImageProps extends React.PropsWithChildren {
  testID?: string
  source: MultiPlatformImageSource
  alt: string
}

const loadRandomImagePlaceholder = (colors: string[] = []) => {
  const randomImage = Math.floor(Math.random() * 4)
  const randomColor = Math.floor(Math.random() * colors.length)
  const color = colors[randomColor]
  switch (randomImage) {
    case 1:
      return {
        placeHolder: require('./placeholder-images/placeholder-1.svg'),
        color,
      }
    case 2:
      return {
        placeHolder: require('./placeholder-images/placeholder-2.svg'),
        color,
      }
    case 3:
      return {
        placeHolder: require('./placeholder-images/placeholder-3.svg'),
        color,
      }
    case 4:
      return {
        placeHolder: require('./placeholder-images/placeholder-4.svg'),
        color,
      }
  }
}

export const _CardImage = ({ source, alt, testID }: CardImageProps) => {
  const { theme, styles } = useStyles(cardImageStyle)
  const placeholderImage = useMemo(
    () =>
      loadRandomImagePlaceholder([
        theme.colors.decorative.yellowDefault,
        theme.colors.decorative.greenDefault,
        theme.colors.decorative.purpleDefault,
        theme.colors.decorative.blueLight,
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  return (
    <View testID={testID} style={[styles.imageWrapper, styles.imageBackground(!!source, placeholderImage?.color)]}>
      <Image
        resizeMode="fill"
        width={296}
        height={162}
        stretch
        alt={alt}
        source={source}
        fallbackSource={placeholderImage?.placeHolder}
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
  imageBackground: (hasSource: boolean, bgColor?: string) => ({
    backgroundColor: hasSource ? undefined : bgColor || theme.colors.decorative.yellowDefault,
  }),
}))
_CardImage.displayName = 'CardImage'
