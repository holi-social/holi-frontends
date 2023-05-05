import { useLazyQuery } from '@apollo/client'
import React, { memo, useContext, useEffect, useMemo, useState } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { geoPlaceDetailsQuery } from '@holi/core/location/queries'
import { GeoPlaceDetailsResponse } from '@holi/core/location/queries'
import { PlaceDetails } from '@holi/core/location/typings'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/components/SpacesSeeMore'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { DiscoverSpacesGroup } from '@holi/core/screens/spaces/queries'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { colors } from '@holi/ui/styles/globalVars'

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

  const { topicId, skillId, location, locationId, spaces } = group

  const topic = useMemo(() => topics.find((topic) => topic.id === topicId), [topics, topicId])
  const skill = useMemo(() => skills.find((skill) => skill.id === skillId), [skills, skillId])

  const { totalResults = 0, data: spacesData = [] } = spaces || {}
  const hasMore = totalResults > SPACES_PAGE_SIZE

  const [fetchPlaceDetails] = useLazyQuery<GeoPlaceDetailsResponse>(geoPlaceDetailsQuery)
  const [locationDetails, setLocationDetails] = useState<PlaceDetails | undefined>()

  useEffect(() => {
    if (locationId) {
      fetchPlaceDetails({ variables: { id: locationId } })
        .then((response) => {
          setLocationDetails(response.data?.geo_placeDetails)
        })
        .catch((error) => {
          // TODO(SF) improve? display proper error message to the user?
          logError(
            error,
            `[SpacesGroupSlider.tsx]: Failed to fetch place details for location ${locationId}: ${error.message}`
          )
        })
    }
  }, [fetchPlaceDetails, locationId])

  if (!spacesData.length) {
    return <></>
  }

  const topicQuery = topic ? 'topic=' + topic.slug : ''
  const skillQuery = skill ? 'skill=' + skill.slug : ''
  const locationQuery = locationId || location ? 'location=' + (locationId || location) : ''
  // TODO(SF) retrieve location name from location details query

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
        {!!locationId && locationDetails && (
          // TODO(SF) location id!
          <SpacesFilterPill
            testID="spaces-location-title"
            label={locationDetails.name}
            filterType="location"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?location=${locationId || location}`)}
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
        testID="spaces-group-slider"
        slideGap={8}
        seeMoreButton={
          hasMore ? (
            <SpacesSeeMore
              style={styles.seeMoreCard}
              imageHeight={imageHeight}
              onPress={() => navigate(`/spaces/filter?${seeMoreQueryParams}`)}
              testID={`${testID}-see-more`}
            />
          ) : undefined
        }
      >
        {spacesData.map((space) => (
          <HoliBlockItem
            key={space.id}
            label={space.title}
            title={space.title}
            subtitle={space.location}
            description={space.description}
            imageSrc={space.cover}
            users={space.members.data.map((membership) => membership.user)}
            href={`/spaces/${space.name}`}
            size="large"
            testID="space-link"
          />
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
  },
  spaceCard: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  backgroundWhite: {
    backgroundColor: colors.background10,
  },
})
