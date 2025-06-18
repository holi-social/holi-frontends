import type React from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import SpaceMainImage from '@holi/core/screens/spaces/components/SpaceMainImage'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import type { Space } from '@holi/api/graphql/graphql-codegen'

type SpaceWelcomeProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceWelcome: React.FC<SpaceWelcomeProps> = ({ space, style }) => {
  const { t } = useTranslation()
  return (
    <View style={style}>
      <SpaceMainImage uri={space.cover} blurhash={space.coverBlurhash} label={space.title} />
      <HoliBox padding={[32, 0, 0, 0]} />
      <HoliHeading level="2">{t('spaces.spaceDetails.goal')}</HoliHeading>
      <HoliRichTextOutput
        text={space.description ?? ''}
        style={styles.description}
        allowAllLinks
        testID="space-description"
      />
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
