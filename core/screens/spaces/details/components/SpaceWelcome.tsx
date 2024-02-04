import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceMainImage from '@holi/core/screens/spaces/components/SpaceMainImage'
import { Space } from '@holi/core/screens/spaces/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'

type SpaceWelcomeProps = {
  space: Space
  loading?: boolean
  style?: StyleProp<ViewStyle>
}

const SpaceWelcome: React.VFC<SpaceWelcomeProps> = ({ space, loading = false, style }) => {
  const { t } = useTranslation()
  return (
    <View style={style}>
      <SpaceMainImage uri={space.cover} blurhash={space.coverBlurhash} label={space.title} loading={loading} />
      <HoliBox padding={[32, 0, 0, 0]} />
      <HoliHeading level="2" loading={loading}>
        {t('spaces.spaceDetails.goal')}
      </HoliHeading>
      {!loading ? (
        <HoliRichTextOutput
          text={space.description}
          style={styles.description}
          allowAllLinks
          testID="space-description"
        />
      ) : (
        <HoliText loading style={styles.description} skeletonOptions={{ numberOfLines: 3, width: '100%' }} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  description: {
    marginTop: 16,
    marginBottom: 32,
  },
})

export default SpaceWelcome
