import React, { useCallback } from 'react'
import { GestureResponderEvent, Linking, StyleSheet, View } from 'react-native'

import { Link } from '@holi/core/screens/posts/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export interface LinkPreviewProps extends HoliButtonProps {
  previewData: Link
}

const LinkPreview: React.VFC<LinkPreviewProps> = ({ previewData, onPress, ...props }) => {
  const onLinkPress = useCallback(
    (event: React.SyntheticEvent<Element, Event> | GestureResponderEvent) => {
      onPress?.(event)
      Linking.openURL(previewData.requestedUrl)
    },
    [onPress, previewData.requestedUrl]
  )

  return (
    <HoliButton {...props} inline transparent onPress={onLinkPress}>
      <View style={styles.container}>
        <HoliImage style={styles.image} source={{ uri: previewData.image }} label={previewData.title} />

        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <HoliHeading size="xSmall" numberOfLines={3} style={styles.fontColor}>
              {previewData.title}
            </HoliHeading>

            <HoliText size="extrasmall" numberOfLines={2} style={[styles.fontColor, styles.textMarginTop]}>
              {previewData.description}
            </HoliText>

            <HoliText size="extrasmall" bold style={[styles.fontColor, styles.textMarginTop]}>
              {previewData.origin}
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
