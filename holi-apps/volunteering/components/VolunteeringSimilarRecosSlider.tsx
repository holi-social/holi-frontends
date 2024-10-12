import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { FlatList } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

import { VolunteeringRecosSliderCard } from '@holi-apps/volunteering/components/VolunteeringRecosSliderCard'
import {
  VolunteeringSimilarRecosQueryResponse,
  VolunteeringSimilarRecosQueryVariables,
  volunteeringSimilarRecosQuery,
} from '@holi-apps/volunteering/queries'

export const MAX_RECOS_COUNT = 4

type VolunteeringSimilarRecosProps = {
  engagementId: string
  cardWidth: number
}

const VolunteeringSimilarRecosSlider: React.FC<VolunteeringSimilarRecosProps> = ({
  engagementId,
  cardWidth,
}: VolunteeringSimilarRecosProps) => {
  const { data, loading, refetch } = useQuery<
    VolunteeringSimilarRecosQueryResponse,
    VolunteeringSimilarRecosQueryVariables
  >(volunteeringSimilarRecosQuery, {
    variables: { id: engagementId, offset: 0, limit: MAX_RECOS_COUNT },
    onError: (error) =>
      logError(error, 'Failed to load volunteering engagements', {
        location: 'VolunteeringRecos.volunteeringRecosQuery',
      }),
  })

  useOnRefresh(refetch)

  if (loading && !data) {
    return null
  }

  const { data: recos = [] } = data?.appVolunteering_similarRecommendations || {}
  const recosToRender = recos.slice(0, MAX_RECOS_COUNT)

  return (
    recosToRender.length > 0 && (
      <FlatList
        horizontal
        data={recosToRender}
        renderItem={(info) => <VolunteeringRecosSliderCard item={info.item} index={info.index} cardWidth={cardWidth} />}
      />
    )
  )
}

export default withProfiler(VolunteeringSimilarRecosSlider, { name: 'VolunteeringRecos' })
