import React, { memo, useContext, useMemo } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { useGeolocationDetails } from '@holi/core/location/hooks/useGeolocationDetails'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/discover/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/discover/components/SpacesSeeMore'
import { DiscoverSpacesGroup } from '@holi/core/screens/spaces/discover/queries'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'

const SPACES_PAGE_SIZE = 10

type SpacesGroupSliderProps = {
  group: DiscoverSpacesGroup
  style?: StyleProp<ViewStyle>
  testID?: string
}

const SpacesGroupSlider: React.VFC<SpacesGroupSliderProps> = ({
  group,
  style,
  testID = 'spaces-group-slider',
}: SpacesGroupSliderProps) => {
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const { topics, skills } = useContext(SpaceTermContext)
  const imageHeight = Platform.OS === 'web' ? 160 : screenWidth / 2 - 40

  const { topicId, skillId, locationId, spaces } = group

  const topic = useMemo(() => topics.find((topic) => topic.id === topicId), [topics, topicId])
  const skill = useMemo(() => skills.find((skill) => skill.id === skillId), [skills, skillId])

  const { totalResults = 0, data: spacesData = [] } = spaces || {}
  const hasMore = totalResults > SPACES_PAGE_SIZE

  const { geolocationDetails, loadingGeolocation } = useGeolocationDetails(locationId)

  if (!spacesData.length || loadingGeolocation) {
    return <></>
  }

  const topicQuery = topic ? 'topic=' + topic.slug : ''
  const skillQuery = skill ? 'skill=' + skill.slug : ''
  const locationQuery = locationId ? 'location=' + locationId : ''

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
            onPress={() => navigate(`/spaces/filter?topic=${topic.slug}`)}
          />
        )}
        {!!locationId && geolocationDetails && (
          <SpacesFilterPill
            testID="spaces-location-title"
            label={geolocationDetails.name}
            filterType="location"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?location=${locationId}`)}
          />
        )}
        {skill && (
          <SpacesFilterPill
            testID="spaces-skill-title"
            label={skill.title}
            filterType="skill"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?skill=${skill.slug}`)}
          />
        )}
      </View>
      <SpacesHorizontalSlider
        style={styles.horizontalSlider}
        testID="spaces-group-slider"
        slideGap={8}
        seeMoreButton={
          hasMore ? (
            <SpacesSeeMore
              imageHeight={imageHeight}
              onPress={() => navigate(`/spaces/filter?${seeMoreQueryParams}`)}
              testID={`${testID}-see-more`}
            />
          ) : undefined
        }
        spaces={spacesData}
      />
    </View>
  )
}
export default memo(SpacesGroupSlider)

const styles = StyleSheet.create({
  horizontalSlider: {
    paddingVertical: 13,
  },
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
})
