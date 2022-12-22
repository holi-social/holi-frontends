import React, { memo, useContext, useMemo } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceCard from '@holi/core/screens/spaces/components/SpaceCard'
import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/components/SpacesSeeMore'
import { Space } from '@holi/core/screens/spaces/types'
import { Paged } from '@holi/core/types'

const SPACES_PAGE_SIZE = 10

type SpacesGroupSliderProps = {
  spaces: Paged<Space>
  topicId?: string
  skillId?: string
  location?: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const SpacesGroupSlider: React.VFC<SpacesGroupSliderProps> = ({
  spaces,
  topicId,
  skillId,
  location,
  style,
  testID = 'spaces-group-slider',
}: SpacesGroupSliderProps) => {
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const { topics, skills } = useContext(SpaceTermContext)
  const imageHeight = Platform.OS === 'web' ? 160 : screenWidth / 2 - 40

  const topic = useMemo(() => topics.find((topic) => topic.id === topicId), [topics, topicId])
  const skill = useMemo(() => skills.find((skill) => skill.id === skillId), [skills, skillId])

  const { totalResults = 0, data: spacesData = [] } = spaces || {}
  const hasMore = totalResults > SPACES_PAGE_SIZE

  if (!spacesData.length) {
    return <></>
  }

  const topicQuery = topic ? 'topicId=' + topic.id : ''
  const skillQuery = skill ? 'skillId=' + skill.id : ''
  const locationQuery = location ? 'location=' + location : ''

  const seeMoreQueryParams = [topicQuery, skillQuery, locationQuery].filter((query) => !!query).join('&')

  return (
    <View style={[styles.sliderContainer, style]} testID={testID}>
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
            testID="spaces-location-title"
            label={location}
            filterType="location"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?location=${location}`)}
          />
        )}
        {skill && (
          <SpacesFilterPill
            testID="spaces-skill-title"
            label={skill.title}
            filterType="skill"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?skillId=${skill.id}`)}
          />
        )}
      </View>
      <SpacesHorizontalSlider
        testID="spaces-group-slider"
        slideGap={8}
        seeMoreButton={
          hasMore && (
            <SpacesSeeMore
              style={styles.seeMoreCard}
              imageHeight={imageHeight}
              onPress={() => navigate(`/spaces/filter?${seeMoreQueryParams}`)}
              testID={`${testID}-see-more`}
            />
          )
        }
      >
        {spacesData.map((space) => (
          <SpaceCard key={space.id} space={space} imageHeight={imageHeight} style={styles.spaceCard} />
        ))}
      </SpacesHorizontalSlider>
    </View>
  )
}
export default memo(SpacesGroupSlider)

const styles = StyleSheet.create({
  sliderContainer: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    marginRight: 6,
  },
  seeMoreCard: {
    paddingVertical: 8,
    marginRight: 40,
  },
  spaceCard: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
})
