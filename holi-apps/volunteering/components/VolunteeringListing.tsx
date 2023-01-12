import { useQuery } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliCardComponent from '@holi/ui/components/molecules/HoliCardComponent'
import variables from '@holi/ui/styles/globalVars/variables'

import '@holi-apps/goodnews/queries'
import VolunteeringCardContent from '@holi-apps/volunteering/components/VolunteeringCardContent'
import { VolunteeringEngagementsQuery, VolunteeringEngagementsQueryResponse } from '@holi-apps/volunteering/queries'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringListingProps = Record<string, never>

const ENGAGEMENT_PAGE_SIZE = 10

const VolunteeringListing: React.VFC<VolunteeringListingProps> = () => {
  const { t } = useTranslation()
  const [fetchingMore, setFetchingMore] = useState(false)
  const { loading, error, data, fetchMore } = useQuery<VolunteeringEngagementsQueryResponse>(
    VolunteeringEngagementsQuery,
    {
      variables: {
        offset: 0,
        limit: ENGAGEMENT_PAGE_SIZE,
      },
      fetchPolicy: 'cache-and-network',
    }
  )

  const { data: engagements = [], totalResults = 0 } = data?.appVolunteering_engagements || {}

  const canFetchMore = engagements.length < totalResults

  const memoizedFetchMore = useCallback(() => {
    setFetchingMore(true)
    return fetchMore({
      variables: {
        offset: engagements.length,
      },
    }).finally(() => setFetchingMore(false))
  }, [fetchMore, engagements.length, setFetchingMore])

  const fetchMoreButtonText = fetchingMore
    ? t('volunteering:listing.loadMoreButton.loading')
    : t('volunteering:listing.loadMoreButton.text')

  if (error) {
    logError(error, `[VolunteeringListing.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  // TODO: To be implemented once volunteering opportunity detail view is created
  const handleCardPress = (engagement: VolunteeringEngagement) => {
    console.log(engagement)
  }

  const renderItem = ({ item }: { item: VolunteeringEngagement }) => (
    <View style={styles.cardContainer} key={item.id}>
      <HoliCardComponent
        imageUrl={item.imageUrl}
        imageLabel={item.title ?? ''}
        testID="holiCard"
        onCardPress={() => handleCardPress(item)}
      >
        <VolunteeringCardContent engagement={item} key={item.id} />
      </HoliCardComponent>
    </View>
  )

  const listHeader = (
    <HoliHeading level="1" style={styles.title}>
      {t('volunteering:listing.headline')}
    </HoliHeading>
  )

  const listFooter = () =>
    canFetchMore ? (
      <HoliButtonLoading
        type="primary"
        label={fetchMoreButtonText}
        disabled={fetchingMore}
        icon={fetchingMore ? 'loader-4' : undefined}
        iconSpinning={fetchingMore}
        onPress={memoizedFetchMore}
        style={[styles.loadMoreButton]}
        testID="btn-volunteering-list-load-more"
      />
    ) : (
      <></>
    )

  return (
    <FlatList
      ListHeaderComponent={listHeader}
      ListHeaderComponentStyle={styles.listHeader}
      data={engagements}
      renderItem={renderItem}
      ListFooterComponent={listFooter}
    />
  )
}

export default VolunteeringListing

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginBottom: 32,
  },
  listHeader: {
    paddingTop: Number(variables.topBarHeight) + 24,
    paddingBottom: 32,
  },
  title: {
    fontWeight: '400',
  },
  loadMoreButton: {
    marginTop: 24,
    marginBottom: 48,
  },
})
