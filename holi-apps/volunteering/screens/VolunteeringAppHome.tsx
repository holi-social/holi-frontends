import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { Filter3 } from '@holi/icons/src/generated'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'

import { VolunteeringFilterForm } from '@holi-apps/volunteering/components/VolunteeringFilterForm'
import VolunteeringListingDiscovery from '@holi-apps/volunteering/components/VolunteeringListingDiscovery'
import { useVolunteeringFilters } from '@holi-apps/volunteering/hooks/useVolunteeringFilters'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import { VolunteeringFilterRow } from '@holi-apps/volunteering/components/VolunteeringFilterRow'
import { VolunteeringListingHeader } from '@holi-apps/volunteering/components/VolunteeringListingHeader'
import { Screen } from '@holi/core/components/Screen'

const VolunteeringAppHome = () => {
  const { t } = useTranslation()

  const [filterModalShown, setFilterModalShown] = useState(false)
  const closeModal = useCallback(() => {
    setFilterModalShown(false)
  }, [])

  const { submit, filters, clearFilters, isFiltering, loadingGeolocation, geolocationError } =
    useVolunteeringFilters(closeModal)

  const filterButton = (
    <HoliButtonBell
      label={t('volunteering.filter.heading')}
      icon={Filter3}
      showBell={isFiltering}
      onPress={() => {
        // if pressed too soon, the state is set to true, but the modal is not shown.
        // crude mechanism to recover from this state.
        // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
        if (filterModalShown) setFilterModalShown(false)
        setFilterModalShown(true)
      }}
      testID="btn-to-volunteering-filter-modal"
    />
  )

  return (
    <Screen
      preset="scroll"
      headerOptions={{
        title: t('volunteering.app.name'),
        headerTitleAlign: 'center',
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        headerRight: () =>
          Platform.OS === 'web' ? <HoliHorizontalRow>{filterButton}</HoliHorizontalRow> : filterButton,
      }}
      testID="volunteering-list-container"
      noContainerPaddingWeb={true}
    >
      <HoliModal
        shown={filterModalShown}
        onDismiss={closeModal}
        testID="volunteering-filter-modal"
        label={t('volunteering.filter.heading')}
        autoHeight={false}
        relativeHeight={1}
      >
        <VolunteeringFilterForm onSubmit={submit} filters={filters} clearFilters={clearFilters} />
      </HoliModal>

      <VolunteeringListingHeader />

      <VolunteeringFilterRow onSubmit={() => {}} filters={filters} />

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
