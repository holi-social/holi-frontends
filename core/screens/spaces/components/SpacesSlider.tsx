import React, { memo } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceCard from '@holi/core/screens/spaces/components/SpaceCard'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/components/SpacesSeeMore'
import { Space } from '@holi/core/screens/spaces/types'
import { Topic } from '@holi/core/screens/userprofile/types'

import SpacesFilterPill from './SpacesFilterPill'

type SpacesSliderProps = {
  topic: Topic
  spaces: Space[]
  style?: StyleProp<ViewStyle>
  paddingVertical?: number
  slideGap?: number
  hasMore?: boolean
}

const SpacesSlider: React.VFC<SpacesSliderProps> = ({
  topic,
  spaces,
  style,
  paddingVertical = 8,
  slideGap = 8,
  hasMore = false,
}: SpacesSliderProps) => {
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const testID = 'spaces-topic-container'
  const imageHeight = Platform.OS === 'web' ? 160 : screenWidth / 2 - 40

  return (
    <View style={[styles.slider, style]} testID={testID}>
      <View style={styles.sliderHeader}>
        <SpacesFilterPill
          testID="spaces-topic-title"
          label={topic.title}
          filterType="topic"
          onPress={() => navigate(`/spaces/filter?topicId=${topic.id}`)}
        />
      </View>
      <SpacesHorizontalSlider
        slideGap={slideGap}
        seeMoreButton={
          hasMore && (
            <SpacesSeeMore
              style={{ paddingVertical, marginRight: 40 }}
              imageHeight={imageHeight}
              onPress={() => navigate(`/spaces/filter?topicId=${topic.id}`)}
              testID={`${testID}-see-more`}
            />
          )
        }
      >
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            imageHeight={imageHeight}
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
export default memo(SpacesSlider)

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
