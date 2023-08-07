import { useQuery } from '@apollo/client'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useGeolocationDetails } from '@holi/core/location/hooks/useGeolocationDetails'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/discover/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/discover/components/SpacesSeeMore'
import {
  DiscoverSpacesData,
  DiscoverSpacesVariables,
  discoverSpacesQuery,
} from '@holi/core/screens/spaces/discover/queries'
import { Space, SpaceMember } from '@holi/core/screens/spaces/types'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { colors } from '@holi/ui/styles/globalVars'

interface BaseProps {
  style?: StyleProp<ViewStyle>
  testID?: string
  pageSize: number
}

interface SelfLoadingTopicProps extends BaseProps {
  topic: Topic
  skill?: never
  locationId?: never
}

interface SelfLoadingSkillProps extends BaseProps {
  topic?: never
  skill: Skill
  locationId?: never
}

interface SelfLoadingLocationProps extends BaseProps {
  topic?: never
  skill?: never
  locationId: string
}

type ContentProps = SelfLoadingTopicProps | SelfLoadingSkillProps | SelfLoadingLocationProps

type SkeletonProps = Partial<ContentProps> & {
  loading: true
}

type Props = ContentProps & {
  loading?: false
}

type SpacesGroupSliderProps = SkeletonProps | Props

const SpacesGroupSlider: React.FC<SpacesGroupSliderProps> = ({
  loading: manualLoading = false,
  style,
  testID = 'spaces-group-slider',
  topic,
  skill,
  locationId,
  pageSize = 5,
}: SpacesGroupSliderProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()
  const { width: windowWidth } = useWindowDimensions()

  const { geolocationDetails, loadingGeolocation } = useGeolocationDetails(locationId)

  // cardWidth is used for image scaling (see usage). this is fine,
  // because value is constant in web and for mobile windowWidth doesn't change
  const cardWidth = Platform.OS === 'web' ? 320 : windowWidth / 1.5 - 12
  const imageHeight = Platform.OS === 'web' ? 160 : windowWidth / 2 - 40

  const {
    loading: dataLoading,
    data,
    error,
  } = useQuery<DiscoverSpacesData, DiscoverSpacesVariables>(discoverSpacesQuery, {
    variables: {
      // component is either parameterized with topic or skill, so this doesn't fetch both
      topicIds: topic ? [topic.id] : [],
      skillIds: skill ? [skill.id] : [],
      geolocation: geolocationDetails?.geolocation,
      limit: pageSize,
      offset: 0,
    },
    skip: manualLoading || loadingGeolocation,
    fetchPolicy: 'cache-and-network',
  })
  const fetchedSpaces = data?.discoverSpaces?.[0]?.spaces
  useEffect(() => {
    if (error) {
      displayError(error, t('spaces.spaceListing.error'))
    }
  }, [error, displayError, t])

  const { totalResults = 0, data: spacesData = [] } = fetchedSpaces ?? {}
  const hasMore = totalResults > (pageSize ?? 0) // false in loading state

  const topicQuery = topic ? 'topic=' + topic.slug : ''
  const skillQuery = skill ? 'skill=' + skill.slug : ''
  const locationQuery = locationId ? 'location=' + locationId : ''

  const seeMoreQueryParams = [topicQuery, skillQuery, locationQuery].filter((query) => !!query).join('&')

  const loading = manualLoading || dataLoading || loadingGeolocation

  if (!loading && totalResults === 0) {
    // some topics or skills don't have associated spaces, then we just choose to not display them for now
    return <></>
  }

  return (
    <View style={[styles.sliderContainer, style]} testID={testID}>
      <View style={styles.sliderHeader}>
        {loading && !locationId && !topic && !skill && <SpacesFilterPill loading={true} style={styles.pill} />}
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
        {loading
          ? new Array(pageSize).fill(1).map((_, idx) => {
              return <HoliBlockItem key={idx} loading={true} size="large" testID="space-link" />
            })
          : spacesData.map((space: Space) => (
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
