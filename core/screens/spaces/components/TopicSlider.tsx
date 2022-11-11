import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space } from '@holi/core/screens/spaces/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type TopicSliderProps = {
  topic: string
  id: number
  spaces: Space[]
  style?: StyleProp<ViewStyle>
}

const TopicSlider: React.VFC<TopicSliderProps> = ({ topic, id, spaces, style }: TopicSliderProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  return (
    <View style={[{ marginBottom: 24 }, style]}>
      <View style={styles.sliderHeader} testID={'donations-updates-heading'}>
        <HoliText size="large">{topic}</HoliText>
        <HoliButton
          label={t('spaces.showAll')}
          onPress={() => navigate(`/spaces/topics/${id}`)}
          transparent
          inline
          testID={'donations-updates-load-more-button'}
        >
          <HoliText>{t('spaces.viewAll')}</HoliText>
        </HoliButton>
      </View>
      {spaces.map((space) => (
        <HoliButton key={space.id} label={space.title} onPress={() => navigate(`/spaces/${space.id}`)}>
          <HoliText>{space.title}</HoliText>
        </HoliButton>
      ))}
    </View>
  )
}
export default TopicSlider

const styles = StyleSheet.create({
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
