import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliCardComponent from '@holi/ui/components/molecules/HoliCardComponent'
import variables from '@holi/ui/styles/globalVars/variables'

import '@holi-apps/goodnews/queries'
import VolunteeringCardContent from '@holi-apps/volunteering/components/VolunteeringCardContent'
import { VolunteeringEngagementsQuery, VolunteeringEngagementsQueryResponse } from '@holi-apps/volunteering/queries'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringListingProps = Record<string, never>

const VolunteeringListing: React.VFC<VolunteeringListingProps> = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { loading, error, data } = useQuery<VolunteeringEngagementsQueryResponse>(VolunteeringEngagementsQuery, {
    // TODO: remove hard coded values for pagination
    variables: {
      offset: 0,
      limit: 10,
    },
  })
  console.log('data --->', data)

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
    console.log('engagement ', engagement)
    navigate(`/apps/volunteering/engagement/${engagement.id}`)
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

  return (
    <FlatList
      ListHeaderComponent={listHeader}
      ListHeaderComponentStyle={styles.listHeader}
      data={engagements}
      renderItem={renderItem}
    />
  )
}

export default VolunteeringListing

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginBottom: 16,
  },
  listHeader: {
    paddingTop: Number(variables.topBarHeight) + 24,
    paddingBottom: 32,
  },
  title: {
    fontWeight: '400',
  },
})
