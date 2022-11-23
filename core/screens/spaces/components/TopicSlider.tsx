import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliSlider from '@holi/core/screens/spaces/components/HoliSlider'
import TopicSliderCard from '@holi/core/screens/spaces/components/TopicSliderCard'
import { Space } from '@holi/core/screens/spaces/types'
import { Topic } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type TopicSliderProps = {
  topic: Topic
  spaces: Space[]
  style?: StyleProp<ViewStyle>
}

const TopicSlider: React.VFC<TopicSliderProps> = ({ topic, spaces, style }: TopicSliderProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  return (
    <View style={[styles.slider, style]} testID="spaces-topic-container">
      <View style={styles.sliderHeader}>
        <HoliText size="large">{topic.title}</HoliText>
        <HoliButton
          label={`${topic} - ${t('spaces.viewAll')}`}
          onPress={() => navigate(`/spaces/topic/${topic.id}`)}
          transparent
          inline
        >
          <HoliText size="small">{t('spaces.viewAll')}</HoliText>
        </HoliButton>
      </View>
      <HoliSlider size="large">
        {spaces.map((space) => (
          <TopicSliderCard key={space.id} space={space} />
        ))}
      </HoliSlider>
    </View>
  )
}
export default memo(TopicSlider)

const styles = StyleSheet.create({
  slider: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
})
