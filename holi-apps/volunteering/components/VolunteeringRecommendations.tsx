import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native-unistyles'

import { VolunteeringEngagementList } from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useVolunteeringRecos } from '@holi-apps/volunteering/hooks/useVolunteeringRecos'

export const VolunteeringRecommendations = () => {
  const { isLoading, engagements, canFetchMore, fetchNextPage } = useVolunteeringRecos({ displayErrors: true })

  const loadMoreComponent = useMemo(() => {
    return (
      <ScrollBasedCallbackInvocation
        callback={fetchNextPage}
        placeholder={<HoliLoader style={styles.loaderBottom} testID="volunteering-loader" />}
      />
    )
  }, [fetchNextPage])

  return (
    <VolunteeringEngagementList
      engagements={engagements}
      isLoading={isLoading}
      footerComponent={canFetchMore && loadMoreComponent}
    />
  )
}

const styles = StyleSheet.create({
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})
