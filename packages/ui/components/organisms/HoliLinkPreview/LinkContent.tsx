import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Link } from '@holi/core/screens/posts/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export interface LinkContentProps extends Link {
  style?: StyleProp<ViewStyle>
}

const LinkContent: React.VFC<LinkContentProps> = ({ image, title, description, origin, style }) => {
  return (
    <View style={[styles.container, style]}>
      {image && <HoliImage style={styles.image} source={{ uri: image }} label={title} />}

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <HoliHeading size="xSmall" numberOfLines={3} style={styles.fontColor}>
            {title}
          </HoliHeading>

          <HoliText size="extrasmall" numberOfLines={2} style={[styles.fontColor, styles.textMarginTop]}>
            {description}
          </HoliText>

          <HoliText size="extrasmall" bold style={[styles.fontColor, styles.textMarginTop]}>
            {origin}
          </HoliText>
        </View>

        <HoliIcon icon="share-box" color={colors.fontColorGrey} size={18} style={styles.shareIcon} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderColorGrey,
  },
  image: {
    aspectRatio: 295 / 151,
    width: '100%',
    backgroundColor: colors.backgroundColorGreyLight,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
  },
  shareIcon: {
    marginLeft: 12,
    marginTop: 4,
  },
  textMarginTop: {
    marginTop: 8,
  },
  fontColor: {
    color: colors.fontColorGrey,
  },
})

export default LinkContent
