import { useQuery } from '@apollo/client'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import HoliCardComponent from '@holi/ui/components/molecules/HoliCardComponent'

import '@holi-apps/goodnews/queries'
import { VolunteeringEngagementsQuery, VolunteeringEngagementsQueryResponse } from '@holi-apps/volunteering/queries'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

import VolunteeringCardContent from './VolunteeringCardContent'

type VolunteeringListingProps = Record<string, never>

const VolunteeringListing: React.VFC<VolunteeringListingProps> = () => {
  const { loading, error, data } = useQuery<VolunteeringEngagementsQueryResponse>(VolunteeringEngagementsQuery, {
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

  const handleCardPress = (engagement: VolunteeringEngagement) => {
    //ToDo Remove the log once implement the functionality
    console.log('engagement ', engagement)
  }

  return (
    <>
      {
        /** FIXME convert to VirtualizedList, FlatList or SectionList */
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        engagements!.map((engagement: VolunteeringEngagement) => {
          return (
            <View style={styles.volunteeringCardContainer} key={engagement.id}>
              <HoliCardComponent
                imageUrl={engagement.imageUrl}
                imageLabel={engagement.title ?? ''}
                testID="holiCard"
                onCardPress={() => handleCardPress(engagement)}
              >
                <VolunteeringCardContent engagement={engagement} key={engagement.id} />
              </HoliCardComponent>
            </View>
          )
        })
      }
    </>
  )
}

export default VolunteeringListing

const styles = StyleSheet.create({
  volunteeringCardContainer: {
    marginBottom: 16,
  },
})
