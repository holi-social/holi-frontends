import React, { memo } from 'react'
import { Linking, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { SpaceLink } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Discord, Facebook, Instagram, Linkedin, Links, Twitter, Whatsapp } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type SpacePublicLinkProps = {
  link: SpaceLink
  style?: StyleProp<ViewStyle>
}

const IconBySpaceLinkType = {
  DISCORD: Discord,
  FACEBOOK: Facebook,
  INSTAGRAM: Instagram,
  LINKEDIN: Linkedin,
  TWITTER: Twitter,
  WHATSAPP: Whatsapp,
  OTHER: Links,
}

const SpacePublicLink: React.VFC<SpacePublicLinkProps> = ({ link, style }: SpacePublicLinkProps) => {
  const { url, name, type } = link

  // For web URLs, the protocol ("http://", "https://") must be set accordingly: https://reactnative.dev/docs/linking
  const urlPrefix = !url.includes('http://') && !url.includes('https://') ? 'https://' : ''

  return (
    <HoliButton
      inline
      transparent
      label={type}
      accessibilityRole="link"
      onPress={() => Linking.openURL(`${urlPrefix}${url}`)}
      style={style}
      contentStyle={styles.button}
      testID="btn-to-social-link"
    >
      <HoliIcon icon={IconBySpaceLinkType[type]} color={colors.foreground20} />
      <HoliText size="small" bold style={styles.text}>
        {name}
      </HoliText>
    </HoliButton>
  )
}
export default memo(SpacePublicLink)

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
  },
})
