import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceMainImage from '@holi/core/screens/spaces/components/SpaceMainImage'
import { Space } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

type SpaceWelcomeProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceWelcome: React.VFC<SpaceWelcomeProps> = ({ space, style }) => {
  const { t } = useTranslation()
  return (
    <View style={style}>
      <SpaceMainImage uri={space.cover} blurHash={space.coverBlurhash} label={space.title} />
      <HoliHeading level="2" style={styles.headline}>
        {t('spaces.spaceDetails.goal')}
      </HoliHeading>
      <HoliText style={styles.description} testID="space-description">
        {space.description}
      </HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  headline: {
    marginTop: 32,
    fontWeight: '400',
  },
  description: {
    marginTop: 16,
    marginBottom: 32,
  },
})

export default SpaceWelcome
