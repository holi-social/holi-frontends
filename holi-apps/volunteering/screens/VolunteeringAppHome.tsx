import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

import VolunteeringListingDiscovery from '@holi-apps/volunteering/components/VolunteeringListingDiscovery'
import { useVolunteeringFilters } from '@holi-apps/volunteering/hooks/useVolunteeringFilters'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { VolunteeringFilterRow } from '@holi-apps/volunteering/components/VolunteeringFilterRow'
import { Screen } from '@holi/core/components/Screen'
import { Stack } from 'holi-bricks/components/stack'
import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'

const VolunteeringAppHome = () => {
  const { t } = useTranslation()

  const { submit, filters, clearFilters, isFiltering, loadingGeolocation, geolocationError } = useVolunteeringFilters()

  const throttledScrollEventProps = useThrottledMobileScrollEvents()

  const headerComponent = (
    <Stack backgroundColor="main">
      <VolunteeringFilterRow
        onSubmit={submit}
        filters={filters}
        loadingFilters={loadingGeolocation}
        clearFilters={clearFilters}
        isFiltering={isFiltering}
      />
    </Stack>
  )

  return (
    <Screen
      preset="scroll"
      headerOptions={{
        title: t('volunteering.app.name'),
        headerTitleAlign: 'center',
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      }}
      testID="volunteering-list-container"
      noContainerPaddingWeb={true}
      StickyTopComponent={headerComponent}
      scrollViewProps={throttledScrollEventProps}
    >
      <VolunteeringListingDiscovery
        filters={filters}
        clearFilters={clearFilters}
        isFiltering={isFiltering}
        loadingFilters={loadingGeolocation}
        loadingFiltersFailed={!!geolocationError}
      />
    </Screen>
  )
}

const WrappedVolunteeringAppHome = () => {
  return (
    <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.VOLUNTEERING} i18nKey="volunteering.maintenance.feature">
      <VolunteeringAppHome />
    </PosthogFeatureFlagGuard>
  )
}

export default memo(WrappedVolunteeringAppHome)
