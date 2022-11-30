import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceSocialLink from '@holi/core/screens/spaces/components/SpaceSocialLink'
import { Space } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

type SpaceSocialLinkListProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceSocialLinkList: React.VFC<SpaceSocialLinkListProps> = ({ space, style }: SpaceSocialLinkListProps) => {
  const { t } = useTranslation()

  const { links = [] } = space

  if (!links.length) return <></>

  return (
    <View style={style}>
      <HoliHeading level="2">{t('spaces.links.heading')}</HoliHeading>
      <View style={styles.linksContainer}>
        {links.map((link, index) => (
          <SpaceSocialLink key={index} link={link} style={styles.link} />
        ))}
      </View>
    </View>
  )
}
export default memo(SpaceSocialLinkList)

const styles = StyleSheet.create({
  linksContainer: {
    marginTop: 28,
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  link: {
    marginRight: 20,
    marginBottom: 20,
  },
})
