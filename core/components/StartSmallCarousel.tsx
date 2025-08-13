import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Stack } from 'holi-bricks/components/stack'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { MiniCard } from 'holi-bricks/components/miniCard/MiniCard'
import { Footprints, GlobalFilled, MapPin2Filled } from '@holi/icons/src/generated'
import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { TrackingEvent } from '@holi/core/tracking'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { useMicroactions } from '@holi-apps/volunteering/hooks/useMicroactions'
import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'
import { Button } from 'holi-bricks/components/button'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { linkFromLocator } from '@holi/core/typesense/helpers/linkFromLocator'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { Text } from 'holi-bricks/components/text'

const StartSmallCarousel = () => {
  const { t } = useTranslation()
  const { user, isLoading: isLoadingUser } = useLoggedInUser()
  const { geolocationDetails, loadingGeolocation: isLoadingGeolocation } = useGeolocationDetails(user?.geolocationId)

  const {
    engagements,
    fetchNextPage,
    canFetchMore,
    isLoading: isLoadingEngagements,
  } = useMicroactions({ userLocation: geolocationDetails, skip: isLoadingUser || isLoadingGeolocation })

  const isLoading = isLoadingUser || isLoadingGeolocation || isLoadingEngagements

  const listProps = {
    horizontal: true,
    contentContainerStyle: {
      paddingHorizontal: Spacing.xs,
      gap: Spacing['3xs'],
    },
    data: engagements,
    ListFooterComponent:
      canFetchMore || !engagements.length ? (
        <View style={{ flex: 1, minHeight: 261 }}>
          <HoliMoreCard
            role="link"
            label={t('act.startSmall.showMore')}
            onPress={fetchNextPage}
            hasButton
            bgImageSrc={require('@holi/ui/assets/img/placeholder/placeholder-blue.svg')}
            fixedWidth={146}
          >
            <Button
              label={t('act.startSmall.showMore')}
              size="sm"
              onPress={fetchNextPage}
              loading={isLoadingEngagements}
            />
          </HoliMoreCard>
        </View>
      ) : (
        <></>
      ),
  }

  const listItemTrackingEvent: ListItemTrackingEvent<LocalizedTypesenseDocument> = (item) => {
    return TrackingEvent.RecommendationViewed('volunteering_opportunity', {
      title: item?.title,
      id: item?.id,
      commitmentType: item.commitment_label,
      locationType: item.location_type,
      source: item.source,
      sourceSection: 'Micro Action',
    })
  }

  const listItemIdentifier: ListItemIdentifier<LocalizedTypesenseDocument> = (item) => item.id

  const ListComponent = (
    <TrackableFlatList
      renderItem={({ item, index }) => (
        <HoliLinkTracked
          href={linkFromLocator(item.type, item.link_locators)}
          label={item.title}
          trackingEvent={TrackingEvent.RecommendationPressed(
            item.type === 'task' ? 'space_task' : 'volunteering_opportunity',
            item.id,
            index,
            {
              commitmentType: item.commitment_label,
              locationType: item.location_type,
              source: item.source,
              sourceSection: 'Micro Action',
            }
          )}
        >
          <View style={{ height: '100%' }}>
            <MiniCard
              title={item.title}
              chipLabel={
                item.commitment_duration
                  ? t(`volunteering.engagement.commitment_duration.${item.commitment_duration}`)
                  : undefined
              }
              bottomIconLeft={
                item.location_type === 'remote' ? GlobalFilled : item.location ? MapPin2Filled : undefined
              }
              bottomLabel={
                item.location_type === 'remote' ? t('volunteering.engagement.location_type.remote') : item.location
              }
              imageSrc={item.image_url}
            />
          </View>
        </HoliLinkTracked>
      )}
      {...listProps}
      listItemTrackingEvent={listItemTrackingEvent}
      listItemIdentifier={listItemIdentifier}
    />
  )

  if (!isLoading && engagements.length === 0) {
    return null
  }

  return (
    <View style={styles.startSmallCarousel}>
      <Stack gap="sm" minHeight="auto" flex={1}>
        <Stack direction="column" padding={{ left: 'xs', right: 'xs' }}>
          <Stack direction="row" gap="3xs">
            <HoliIcon icon={Footprints} size={24} color="informative" />
            <Text size="xl" headingLevel="3">
              {t('act.startSmall.title')}
            </Text>
          </Stack>
          <Stack padding={{ left: 'lg' }}>
            <Text size="sm" color="support">
              {t('act.startSmall.subline')}
            </Text>
          </Stack>
        </Stack>

        {ListComponent}
      </Stack>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  startSmallCarousel: {
    backgroundColor: theme.colors.decorative.purpleLight,
    paddingVertical: Spacing['xs'],
    borderRadius: BorderRadius.md,
    gap: Spacing['xs'],
  },
}))

export default StartSmallCarousel
