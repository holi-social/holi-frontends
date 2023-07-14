import React, { memo, useContext, useMemo } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { useGeolocationDetails } from '@holi/core/location/hooks/useGeolocationDetails'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/discover/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/discover/components/SpacesSeeMore'
import { DiscoverSpacesGroup } from '@holi/core/screens/spaces/discover/queries'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Space, SpaceMember } from '@holi/core/screens/spaces/types'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { colors } from '@holi/ui/styles/globalVars'

const SPACES_PAGE_SIZE = 10

interface BaseProps {
  style?: StyleProp<ViewStyle>
  testID?: string
}

interface SkeletonProps extends BaseProps {
  loading: true
  group?: DiscoverSpacesGroup
}

interface Props extends BaseProps {
  loading?: false
  group: DiscoverSpacesGroup
}

type SpacesGroupSliderProps = SkeletonProps | Props

const HoliBlockItemSkeletons: React.FC = () => {
  return (
    <>
      {new Array(Platform.OS == 'web' ? 10 : 2).fill(1).map((_, idx) => {
        return <HoliBlockItem key={idx} loading={true} size="large" />
      })}
    </>
  )
}

const SpacesGroupSlider: React.FC<SpacesGroupSliderProps> = ({
  loading,
  group,
  style,
  testID = 'spaces-group-slider',
}: SpacesGroupSliderProps) => {
  const { navigate } = useRouting()
  const { width: windowWidth } = useWindowDimensions()
  const { topics, skills } = useContext(SpaceTermContext)

  // cardWidth is used for image scaling (see usage). this is fine,
  // because value is constant in web and for mobile windowWidth doesn't change
  const cardWidth = Platform.OS === 'web' ? 320 : windowWidth / 1.5 - 12
  const imageHeight = Platform.OS === 'web' ? 160 : windowWidth / 2 - 40

  const topicId = group?.topicId
  const skillId = group?.skillId

  const topic = useMemo(() => topics.find((topic) => topic.id === topicId), [topics, topicId])
  const skill = useMemo(() => skills.find((skill) => skill.id === skillId), [skills, skillId])

  const { totalResults = 0, data: spacesData = [] } = group?.spaces || {}
  const hasMore = totalResults > SPACES_PAGE_SIZE

  const locationId = group?.locationId
  const { geolocationDetails, loadingGeolocation } = useGeolocationDetails(locationId)

  const topicQuery = topic ? 'topic=' + topic.slug : ''
  const skillQuery = skill ? 'skill=' + skill.slug : ''
  const locationQuery = locationId ? 'location=' + locationId : ''

  const seeMoreQueryParams = [topicQuery, skillQuery, locationQuery].filter((query) => !!query).join('&')

  return (
    <View style={[styles.sliderContainer, style]} testID={testID}>
      <View style={styles.sliderHeader}>
        {loading && <SpacesFilterPill loading={true} style={styles.pill} />}
        {topic && (
          <SpacesFilterPill
            testID="spaces-topic-title"
            label={topic.title}
            filterType="topic"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?topic=${topic.slug}`)}
          />
        )}
        {!!locationId && (
          <SpacesFilterPill
            testID="spaces-location-title"
            // never shows an empty string because we would be in a loading state
            label={geolocationDetails?.name ?? ''}
            loading={loadingGeolocation}
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
        loading={loading}
        testID="spaces-group-slider"
        cardWidth={cardWidth}
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
        {loading ? (
          <HoliBlockItemSkeletons />
        ) : (
          spacesData.map((space: Space) => (
            <HoliBlockItem
              key={space.id}
              label={space.title}
              title={space.title}
              subtitle={space.location}
              description={space.description}
              imageSrc={space.cover}
              imageBlurhash={space.coverBlurhash}
              users={space.members.data.map((membership: SpaceMember) => membership.user)}
              href={`/spaces/${space.name}`}
              size="large"
              testID="space-link"
              totalUserCount={space.members.totalResults}
              cardWidthForImageScaling={cardWidth}
            />
          ))
        )}
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
