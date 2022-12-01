import React, { memo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliSlider from '@holi/core/screens/spaces/components/HoliSlider'
import SpaceCard from '@holi/core/screens/spaces/components/SpaceCard'
import { Space } from '@holi/core/screens/spaces/types'
import { Topic } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'

type TopicSliderProps = {
  topic: Topic
  spaces: Space[]
  style?: StyleProp<ViewStyle>
  paddingVertical: number
  slideGap: number
}

const TopicSlider: React.VFC<TopicSliderProps> = ({
  topic,
  spaces,
  style,
  paddingVertical = 8,
  slideGap = 8,
}: TopicSliderProps) => {
  return (
    <View style={[styles.slider, style]} testID="spaces-topic-container">
      <View style={styles.sliderHeader}>
        <HoliText size="large">{topic.title}</HoliText>
      </View>
      <HoliSlider topic={topic} paddingVertical={paddingVertical} slideGap={slideGap}>
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            style={{
              paddingVertical: paddingVertical,
              paddingHorizontal: slideGap,
              marginRight: slideGap,
            }}
          />
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
