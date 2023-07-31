import { useQuery } from '@apollo/client'
import React, { memo, useContext, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useGeolocationDetails } from '@holi/core/location/hooks/useGeolocationDetails'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/discover/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/discover/components/SpacesSeeMore'
import {
  DiscoverSpacesGroup,
  DiscoverSpacesResponse,
  discoverSpacesQuery,
} from '@holi/core/screens/spaces/discover/queries'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Space, SpaceMember } from '@holi/core/screens/spaces/types'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { colors } from '@holi/ui/styles/globalVars'

interface BaseProps {
  style?: StyleProp<ViewStyle>
  testID?: string
  pageSize: number
}

interface LoadedGroupProps extends BaseProps {
  group: DiscoverSpacesGroup
  topic?: never
  skill?: never
}

interface SelfLoadingTopicProps extends BaseProps {
  group?: never
  topic: Topic
  skill?: never
}

interface SelfLoadingSkillProps extends BaseProps {
  group?: never
  topic?: never
  skill: Skill
}

type ContentProps = LoadedGroupProps | SelfLoadingTopicProps | SelfLoadingSkillProps

type SkeletonProps = Partial<ContentProps> & {
  loading: true
}

type Props = ContentProps & {
  loading?: false
}

type SpacesGroupSliderProps = SkeletonProps | Props

const SpacesGroupSlider: React.FC<SpacesGroupSliderProps> = ({
  loading: forcedLoading = false,
  style,
  testID = 'spaces-group-slider',
  group,
  topic,
  skill,
  pageSize,
}: SpacesGroupSliderProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()
  const { width: windowWidth } = useWindowDimensions()
  const { topics, skills } = useContext(SpaceTermContext)

  // cardWidth is used for image scaling (see usage). this is fine,
  // because value is constant in web and for mobile windowWidth doesn't change
  const cardWidth = Platform.OS === 'web' ? 320 : windowWidth / 1.5 - 12
  const imageHeight = Platform.OS === 'web' ? 160 : windowWidth / 2 - 40

  const topicId = group?.topicId
  const skillId = group?.skillId

  const memoTopic = useMemo(() => topic ?? topics.find((topic) => topic.id === topicId), [topic, topics, topicId])
  const memoSkill = useMemo(() => skill ?? skills.find((skill) => skill.id === skillId), [skill, skills, skillId])

  const {
    loading: dataLoading,
    data,
    error,
  } = useQuery<DiscoverSpacesResponse>(discoverSpacesQuery, {
    variables: {
      // component is either parameterized with topic or skill, so this doesn't fetch both
      topicIds: topic ? [topic.id] : [],
      skillIds: skill ? [skill.id] : [],
      limit: pageSize,
      offset: 0,
    },
    skip: group !== undefined || forcedLoading,
    fetchPolicy: 'network-only',
  })
  const fetchedSpaces = data?.discoverSpaces?.[0]?.spaces
  useEffect(() => {
    if (error) {
      displayError(error, t('spaces.spaceListing.error'))
    }
  }, [error, displayError, t])

  const { totalResults = 0, data: spacesData = [] } = group?.spaces ?? fetchedSpaces ?? {}
  const hasMore = totalResults > (pageSize ?? 0) // false in loading state

  const locationId = group?.locationId
  const { geolocationDetails, loadingGeolocation } = useGeolocationDetails(locationId)

  const topicQuery = memoTopic ? 'topic=' + memoTopic.slug : ''
  const skillQuery = memoSkill ? 'skill=' + memoSkill.slug : ''
  const locationQuery = locationId ? 'location=' + locationId : ''

  const seeMoreQueryParams = [topicQuery, skillQuery, locationQuery].filter((query) => !!query).join('&')

  const loading = forcedLoading || dataLoading

  const elementRef = useRef<View>(null)

  if (!loading && totalResults === 0) {
    // some topics or skills don't have associated spaces, then we just choose to not display them for now
    return <></>
  }

  return (
    <View ref={elementRef} style={[styles.sliderContainer, style]} testID={testID}>
      <View style={styles.sliderHeader}>
        {loading && !memoTopic && !memoSkill && <SpacesFilterPill loading={true} style={styles.pill} />}
        {memoTopic && (
          <SpacesFilterPill
            testID="spaces-topic-title"
            label={memoTopic.title}
            filterType="topic"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?topic=${memoTopic.slug}`)}
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
        {memoSkill && (
          <SpacesFilterPill
            testID="spaces-skill-title"
            label={memoSkill.title}
            filterType="skill"
            style={styles.pill}
            onPress={() => navigate(`/spaces/filter?skill=${memoSkill.slug}`)}
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
              return <HoliBlockItem key={idx} loading={true} size="large" />
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
