import { useQuery } from '@apollo/client'
import { ChipAction } from 'holi-bricks/components/chips'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle, useWindowDimensions } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { isSSR } from '@holi/core/helpers/isSSR'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/discover/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/discover/components/SpacesSeeMore'
import {
  type DiscoverSpacesData,
  type DiscoverSpacesVariables,
  discoverSpacesQuery,
} from '@holi/core/screens/spaces/discover/queries'
import type { Space } from '@holi/core/screens/spaces/types'
import { MapPinLine } from '@holi/icons/src/generated'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import Spacing from '@holi/ui/foundations/Spacing'

interface BaseProps {
  style?: StyleProp<ViewStyle>
  testID?: string
  pageSize: number
}

interface SelfLoadingTopicProps extends BaseProps {
  topic: string
  skill?: never
  locationId?: never
}

interface SelfLoadingSkillProps extends BaseProps {
  topic?: never
  skill: string
  locationId?: never
}

interface SelfLoadingLocationProps extends BaseProps {
  topic?: never
  skill?: never
  locationId?: string
}

type ContentProps = SelfLoadingTopicProps | SelfLoadingSkillProps | SelfLoadingLocationProps

const SpacesGroupSlider = ({
  loading: manualLoading = false,
  style,
  testID = 'spaces-group-slider',
  topic,
  skill,
  locationId,
  pageSize = 5,
}: PropsWithSkeleton<ContentProps>) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()
  const { width: windowWidth } = useWindowDimensions()
  const styles = getStyles()

  const { geolocationDetails, loadingGeolocation } = useGeolocationDetails(locationId)

  // cardWidth is used for image scaling (see usage). this is fine,
  // because value is constant in web and for mobile windowWidth doesn't change
  const cardWidth = Platform.OS === 'web' ? 320 : windowWidth / 1.5 - 12

  const topicFilter = topic ? { topicsV2: [topic] } : {}
  const skillFilter = skill ? { skillsV2: [skill] } : {}
  const { data } = useQuery<DiscoverSpacesData, DiscoverSpacesVariables>(discoverSpacesQuery, {
    variables: {
      // component is either parameterized with topic or skill, so this doesn't fetch both
      ...topicFilter,
      ...skillFilter,
      geolocation: geolocationDetails?.geolocation,
      limit: pageSize,
      offset: 0,
    },
    skip: manualLoading || loadingGeolocation,
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error) =>
      displayError(error, 'Failed to discover spaces', {
        displayMessage: t('spaces.spaceListing.error'),
        location: 'SpacesGroupSlider.discoverSpacesQuery',
      }),
  })
  const fetchedSpaces = data?.discoverSpaces?.[0]?.spaces

  const { totalResults = 0, data: spacesData = [] } = fetchedSpaces ?? {}
  const hasMore = totalResults > (pageSize ?? 0) // false in loading state

  const topicQuery = topic ? 'topic=' + topic : ''
  const skillQuery = skill ? 'skill=' + skill : ''
  const locationQuery = locationId ? 'location=' + locationId : ''

  const seeMoreQueryParams = [topicQuery, skillQuery, locationQuery].filter((query) => !!query).join('&')

  const loading = manualLoading || !fetchedSpaces || loadingGeolocation

  if (!loading && totalResults === 0) {
    // some topics or skills don't have associated spaces, then we just choose to not display them for now
    return <></>
  }

  return (
    <View style={style} testID={testID}>
      <View style={styles.sliderHeader}>
        {topic && (
          <ChipAction onPress={() => navigate(`/spaces/filter?topic=${topic}`)} color="green" id="spaces-topic-title">
            {t(`topic.${topic}`)}
          </ChipAction>
        )}
        {!!locationId && (
          <ChipAction
            onPress={() => navigate(`/spaces/filter?location=${locationId}`)}
            iconLeading={MapPinLine}
            id="spaces-location-title"
          >
            {geolocationDetails?.name ?? ''}
          </ChipAction>
        )}
        {skill && (
          <ChipAction onPress={() => navigate(`/spaces/filter?skill=${skill}`)} color="blue" id="spaces-skill-title">
            {t(`skill.${skill}`)}
          </ChipAction>
        )}
      </View>
      <SpacesHorizontalSlider
        loading={loading}
        testID="spaces-group-slider"
        cardWidth={cardWidth}
        slideGap={Spacing.xs}
        seeMoreButton={
          hasMore ? (
            <SpacesSeeMore
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
                href={`/spaces/${space.name}`}
                size="large"
                testID="space-link"
                cardWidthForImageScaling={cardWidth}
              />
            ))}
      </SpacesHorizontalSlider>
    </View>
  )
}
export default memo(SpacesGroupSlider)

const getStyles = () =>
  StyleSheet.create({
    sliderHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.xs,
    },
  })
