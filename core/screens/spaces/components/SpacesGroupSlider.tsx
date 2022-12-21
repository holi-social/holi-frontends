import React, { memo } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceCard from '@holi/core/screens/spaces/components/SpaceCard'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/components/SpacesSeeMore'
import { Space } from '@holi/core/screens/spaces/types'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'

import SpacesFilterPill from './SpacesFilterPill'

type SpacesGroupSliderProps = {
  spaces: Space[]
  topic?: Topic
  skill?: Skill
  location?: string
  style?: StyleProp<ViewStyle>
  paddingVertical?: number
  slideGap?: number
  hasMore?: boolean
  testID?: string
}

const SpacesGroupSlider: React.VFC<SpacesGroupSliderProps> = ({
  spaces,
  topic,
  skill,
  location,
  style,
  paddingVertical = 8,
  slideGap = 8,
  hasMore = false,
  testID = 'spaces-group-slider',
}: SpacesGroupSliderProps) => {
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const imageHeight = Platform.OS === 'web' ? 160 : screenWidth / 2 - 40

  const topicQuery = topic ? 'topicId=' + topic.id : ''
  const skillQuery = skill ? 'skillId=' + skill.id : ''
  const locationQuery = location ? 'location=' + location : ''

  const seeMoreQueryParams = [topicQuery, skillQuery, locationQuery].filter((query) => !!query).join('&')

  return (
    <View style={[styles.slider, style]} testID={testID}>
      <View style={styles.sliderHeader}>
        {topic && (
          <SpacesFilterPill
            testID="spaces-topic-title"
            label={topic.title}
            filterType="topic"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?topicId=${topic.id}`)}
          />
        )}
        {location && (
          <SpacesFilterPill
            testID="spaces-topic-title"
            label={location}
            filterType="location"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?location=${location}`)}
          />
        )}
        {skill && (
          <SpacesFilterPill
            testID="spaces-topic-title"
            label={skill.title}
            filterType="skill"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?skillId=${skill.id}`)}
          />
        )}
      </View>
      <SpacesHorizontalSlider
        slideGap={slideGap}
        seeMoreButton={
          hasMore && (
            <SpacesSeeMore
              style={{ paddingVertical, marginRight: 40 }}
              imageHeight={imageHeight}
              onPress={() => navigate(`/spaces/filter?${seeMoreQueryParams}`)}
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
export default memo(SpacesGroupSlider)

const styles = StyleSheet.create({
  slider: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    marginRight: 6,
  },
})
