import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import usePaginationQuery from '@holi/core/pagination/usePaginationQuery'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import '@holi-apps/goodnews/queries'
import VolunteeringCardContent from '@holi-apps/volunteering/components/VolunteeringCardContent'
import { VolunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'
import { VolunteeringEngagement, VolunteeringFilters } from '@holi-apps/volunteering/types'

type VolunteeringListingProps = {
  clearFilters: () => void
  filters: VolunteeringFilters
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const ENGAGEMENT_PAGE_SIZE = 10

const VolunteeringListing: React.VFC<VolunteeringListingProps> = ({ clearFilters, onScroll, filters = {} }) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const {
    loading,
    data: engagements,
    error,
    totalResults,
    fetchNextPage,
    canFetchMore,
    isFetchingMore,
  } = usePaginationQuery<VolunteeringEngagement>(VolunteeringEngagementsQuery, {
    queryPath: 'appVolunteering_engagements',
    pageSize: ENGAGEMENT_PAGE_SIZE,
    variables: {
      location: filters.location,
      category: filters.category,
    },
    fetchPolicy: 'cache-and-network',
  })

  const fetchMoreButtonText = isFetchingMore ? t('global.loading') : t('volunteering:listing.loadMoreButton.text')

  if (error) {
    logError(error, `[VolunteeringListing.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  const handleCardPress = (engagement: VolunteeringEngagement) => {
    navigate(`/apps/volunteering/engagement/${engagement.id}`)
  }

  const renderItem = ({ item }: { item: VolunteeringEngagement }) => (
    <View style={styles.cardContainer} key={item.id}>
      <HoliCard
        imageUrl={item.imageUrl}
        imageLabel={item.title ?? ''}
        testID="btn-to-volunteering-engagement"
        onCardPress={() => handleCardPress(item)}
      >
        <VolunteeringCardContent engagement={item} key={item.id} />
      </HoliCard>
    </View>
  )

  const isFiltering = !!(filters.location || filters.category)

  const listHeader = (
    <View>
      <HoliHeading level="1" style={styles.title}>
        {t('volunteering:listing.headline')}
      </HoliHeading>

      {isFiltering && (
        <View style={styles.headingRow}>
          <HoliText bold style={{ color: colors.foreground20 }}>
            {t('volunteering:filter.result', {
              count: totalResults,
            })}
          </HoliText>
        </View>
      )}
    </View>
  )

  const listFooter = () =>
    canFetchMore ? (
      <HoliButtonLoading
        type="primary"
        label={fetchMoreButtonText}
        disabled={isFetchingMore}
        icon={isFetchingMore ? 'loader-4' : undefined}
        iconSpinning={isFetchingMore}
        onPress={fetchNextPage}
        style={[styles.loadMoreButton]}
        testID="btn-volunteering-list-load-more"
      />
    ) : (
      <></>
    )

  return (
    <FlatList
      testID={isFiltering ? 'volunteering-list-filtered' : 'volunteering-list-unfiltered'}
      onScroll={onScroll}
      scrollEventThrottle={200}
      ListHeaderComponent={engagements.length ? listHeader : undefined}
      ListHeaderComponentStyle={styles.listHeader}
      contentContainerStyle={[mixins.container, styles.list]}
      data={engagements}
      renderItem={renderItem}
      ListFooterComponent={listFooter}
      ListEmptyComponent={
        <HoliNoResults
          firstText={t('volunteering:filter.notFound.title')}
          secondText={t('volunteering:filter.notFound.description')}
          style={styles.noResults}
        >
          <HoliButton label={t('volunteering:filter.reset')} onPress={clearFilters} inline>
            {t('volunteering:filter.reset')}
          </HoliButton>
        </HoliNoResults>
      }
    />
  )
}

export default VolunteeringListing

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginBottom: 32,
  },
  list: {
    paddingTop: vars.topBarHeight + 24,
    backgroundColor: colors.background20,
  },
  listHeader: {
    paddingBottom: 32,
  },
  title: {
    fontWeight: '400',
  },
  loadMoreButton: {
    marginTop: 24,
    marginBottom: 48,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 16,
  },
  noResults: {
    marginTop: 24,
  },
})
