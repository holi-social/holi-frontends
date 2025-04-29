import React, { useMemo } from 'react'

import { VolunteeringEngagementList } from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { useVolunteeringRecosTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense'

export const VolunteeringTypesenseRecommendations = () => {
  const { styles } = useStyles(stylesheet)

  const { isLoading, engagements, canFetchMore, fetchNextPage } = useVolunteeringRecosTypesense({ displayErrors: true })

  const loadMoreComponent = useMemo(() => {
    return (
      <ScrollBasedCallbackInvocation
        callback={fetchNextPage}
        placeholder={<HoliLoader style={styles.loaderBottom} testID="volunteering-loader" />}
      />
    )
  }, [fetchNextPage, styles.loaderBottom])

  return (
    <VolunteeringEngagementList
      engagements={engagements}
      isLoading={isLoading}
      footerComponent={canFetchMore && loadMoreComponent}
    />
  )
}

const stylesheet = createStyleSheet({
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})
