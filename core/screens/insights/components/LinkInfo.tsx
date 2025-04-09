import React from 'react'
import { StyleSheet, View } from 'react-native'

import { shortHost } from '@holi/core/helpers/url'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { LinkM } from '@holi/icons/src/generated'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText, { type HoliTextColor } from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

type LinkInfoProps = {
  icon?: string
  link: string
  size?: 'md' | 'sm'
  color?: HoliTextColor
}

const LinkInfo = ({ icon, link, size = 'md', color = 'black300' }: LinkInfoProps) => {
  const site = shortHost(link)
  const dimension = size === 'sm' ? styles.sizeSm : styles.sizeMd
  const textSize = size === 'sm' ? 'extrasmall' : 'small'
  const missingIconSize = size === 'sm' ? Spacing.xxs : Spacing.xs

  return (
    <View style={styles.link}>
      {icon ? (
        <HoliImage source={{ uri: icon }} label="" style={{ ...styles.favicon, ...dimension }} />
      ) : (
        <View style={[styles.favicon, dimension, styles.missingFavicon]}>
          <HoliIcon icon={LinkM} size={missingIconSize} colorOverride={colors.brandB300} />
        </View>
      )}
      <HoliText numberOfLines={1} size={textSize} color={color} style={styles.linkText}>
        {site}
      </HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: Spacing['3xs'],
  },
  favicon: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSm: {
    width: Spacing.xs,
    height: Spacing.xs,
  },
  sizeMd: {
    width: Spacing.md,
    height: Spacing.md,
  },
  missingFavicon: {
    backgroundColor: colors.brandB100,
  },
  linkText: {
    flex: 1,
  },
})

export default LinkInfo
