import React, { memo } from 'react'
import { Linking, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { SpaceLink, SpaceLinkType } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceSocialLinkProps = {
  link: SpaceLink
  style?: StyleProp<ViewStyle>
}

const SpaceSocialLink: React.VFC<SpaceSocialLinkProps> = ({ link, style }: SpaceSocialLinkProps) => {
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
      <HoliIcon
        size={24}
        color={colors.foreground20}
        icon={type === SpaceLinkType.OTHER ? 'links' : type.toLowerCase()}
      />
      <HoliText size="small" bold style={styles.text}>
        {name}
      </HoliText>
    </HoliButton>
  )
}
export default memo(SpaceSocialLink)

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
  },
})
