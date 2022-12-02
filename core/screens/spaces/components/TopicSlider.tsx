import React, { memo } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceCard from '@holi/core/screens/spaces/components/SpaceCard'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/components/SpacesSeeMore'
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
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const IMAGE_HEIGHT = Platform.OS === 'web' ? 160 : screenWidth / 2 - 40
  const testID = 'spaces-topic-container'

  return (
    <View style={[styles.slider, style]} testID={testID}>
      <View style={styles.sliderHeader}>
        <HoliText size="large">{topic.title}</HoliText>
      </View>
      <SpacesHorizontalSlider
        slideGap={slideGap}
        seeMoreButton={
          <SpacesSeeMore
            style={{ paddingVertical, marginRight: 40 }}
            imageHeight={IMAGE_HEIGHT}
            onPress={() => navigate(`/spaces/filter?topicId=${topic.id}`)}
            testID={`${testID}-see-more`}
          />
        }
      >
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            imageHeight={IMAGE_HEIGHT}
            style={{
              paddingVertical: paddingVertical,
              paddingHorizontal: slideGap,
              marginRight: slideGap,
            }}
          />
        ))}
      </SpacesHorizontalSlider>
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
