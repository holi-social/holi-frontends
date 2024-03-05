import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { LinkM } from '@holi/icons/src/generated'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

type RecommendedLinkProps = {
  icon?: string
  link: string
}

const RecommendedLink = ({ icon, link }: RecommendedLinkProps) => (
  <View style={styles.link}>
    {icon ? (
      <HoliImage source={{ uri: icon }} label="" style={styles.favicon} />
    ) : (
      <View style={[styles.favicon, styles.missingFavicon]}>
        <HoliIcon icon={LinkM} size={18} color={colors.brandB300} />
      </View>
    )}
    <HoliText numberOfLines={1} size="small" style={styles.linkText}>
      {link}
    </HoliText>
  </View>
)

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3xs'],
  },
  favicon: {
    height: 24,
    width: 24,
    borderRadius: 4,
  },
  missingFavicon: {
    backgroundColor: colors.brandB100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    flex: 1,
  },
})

export default RecommendedLink
