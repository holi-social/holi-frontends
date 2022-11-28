import React, { useCallback } from 'react'
import { GestureResponderEvent, Linking, StyleSheet, View } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

// TODO: remove after getting link data from BE
const linkData = {
  image: 'https://iso.500px.com/wp-content/uploads/2016/03/stock-photo-142984111-1500x1000.jpg',
  title: 'Perfectly Timed Nature Photos',
  description:
    'Nature photographers have the challenging task of taking the already-incredible beauty of nature and maximizing its beauty. These photographers certainly succeeded at that with their pristine, majestic images that are so perfect they look staged. But they’re as real as it gets!',
  link: 'https://www.rd.com/list/amazing-nature-photos/',
  origin: 'rd.com',
}

const LinkPreview: React.VFC<Partial<HoliButtonProps>> = ({ onPress, ...props }) => {
  const onLinkPress = useCallback(
    (event: React.SyntheticEvent<Element, Event> | GestureResponderEvent) => {
      onPress?.(event)
      Linking.openURL(linkData.link)
    },
    [onPress]
  )

  return (
    <HoliButton {...props} label={linkData.title} inline transparent onPress={onLinkPress}>
      <View style={styles.container}>
        <HoliImage style={styles.image} source={{ uri: linkData.image }} label={linkData.title} />

        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <HoliHeading size="xSmall" numberOfLines={3} style={styles.fontColor}>
              {linkData.title}
            </HoliHeading>

            <HoliText size="extrasmall" numberOfLines={2} style={[styles.fontColor, styles.textMarginTop]}>
              {linkData.description}
            </HoliText>

            <HoliText size="extrasmall" bold style={[styles.fontColor, styles.textMarginTop]}>
              {linkData.origin}
            </HoliText>
          </View>

          <HoliIcon icon="share-box" color={colors.fontColorGrey} size={18} style={styles.shareIcon} />
        </View>
      </View>
    </HoliButton>
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

export default LinkPreview
