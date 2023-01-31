import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Space } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceWelcomeProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const IMAGE_ASPECT_RATIO = 327 / 210

const SpaceWelcome: React.VFC<SpaceWelcomeProps> = ({ space, style }) => {
  const { t } = useTranslation()
  return (
    <View style={style}>
      <View style={styles.imageContainer}>
        <HoliImage source={{ uri: space.mainImage }} style={styles.mainImage} label={space.title} />
      </View>
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
  imageContainer: {
    width: '100%',
    aspectRatio: IMAGE_ASPECT_RATIO,
    height: Platform.OS === 'web' ? '100%' : 'auto',
    padding: 8,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.borderColorGrey,
    backgroundColor: colors.backgroundColorWhite,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
})

export default SpaceWelcome
