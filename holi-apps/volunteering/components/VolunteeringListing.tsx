import { useQuery } from '@apollo/client'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import HoliCardComponent from '@holi/ui/components/molecules/HoliCardComponent'

import '@holi-apps/goodnews/queries'
import VolunteeringCardContent from '@holi-apps/volunteering/components/VolunteeringCardContent'
import { VolunteeringEngagementsQuery, VolunteeringEngagementsQueryResponse } from '@holi-apps/volunteering/queries'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringListingProps = Record<string, never>

const VolunteeringListing: React.VFC<VolunteeringListingProps> = () => {
  const { loading, error, data } = useQuery<VolunteeringEngagementsQueryResponse>(VolunteeringEngagementsQuery, {
    // TODO: remove hard coded values for pagination and location filtering
    variables: {
      location: 'Hamburg',
      offset: 0,
      limit: 10,
    },
  })
  const engagements = data?.appVolunteering_engagements?.data || []

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
    <View style={styles.volunteeringCardContainer} key={item.id}>
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

  return <FlatList data={engagements} renderItem={renderItem} />
}

export default VolunteeringListing

const styles = StyleSheet.create({
  volunteeringCardContainer: {
    marginBottom: 16,
  },
})
