import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceMainImage from '@holi/core/screens/spaces/components/SpaceMainImage'
import { Space } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'

type SpaceWelcomeProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceWelcome: React.VFC<SpaceWelcomeProps> = ({ space, style }) => {
  const { t } = useTranslation()
  return (
    <View style={style}>
      <SpaceMainImage uri={space.cover} blurhash={space.coverBlurhash} label={space.title} />
      <HoliHeading level="2" style={styles.headline}>
        {t('spaces.spaceDetails.goal')}
      </HoliHeading>
      <HoliRichTextOutput
        text={space.description}
        style={styles.description}
        allowAllLinks
        testID="space-description"
      />
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
