import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Filter3 } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import VolunteeringDiscoveryV1 from '@holi-apps/volunteering/components/VolunteeringDiscoveryV1'
import VolunteeringFilterForm from '@holi-apps/volunteering/components/VolunteeringFilterForm'
import VolunteeringFilterFormDiscoveryV1 from '@holi-apps/volunteering/components/VolunteeringFilterFormDiscoveryV1'
import VolunteeringListing from '@holi-apps/volunteering/components/VolunteeringListing'
import { useVolunteeringFilters } from '@holi-apps/volunteering/hooks/useVolunteeringFilters'
import { useVolunteeringDiscoveryVariant } from '@holi-apps/volunteering/hooks/useVolunteeringVariant'

const VolunteeringAppHome = () => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const title = t('volunteering:app.name')
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const discoveryVariant = useVolunteeringDiscoveryVariant()

  const [showFilterModal, setShowFilterModal] = useState(false)
  const closeModal = useCallback(() => {
    setShowFilterModal(false)
  }, [])

  const { submit, filters, clearFilters, isFiltering, loadingGeolocation, geolocationError } =
    useVolunteeringFilters(closeModal)

  useIsomorphicLayoutEffect(() => {
    const filterButton = (
      <HoliButton
        label={t('volunteering:filter.heading')}
        inline
        transparent
        onPress={() => {
          // if pressed too soon, the state is set to true, but the modal is not shown.
          // crude mechanism to recover from this state.
          // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
          showFilterModal && setShowFilterModal(false)
          setShowFilterModal(true)
        }}
        testID="btn-to-volunteering-filter-modal"
      >
        <HoliIcon icon={Filter3} />
        {isFiltering && <View style={styles.dot} />}
      </HoliButton>
    )
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="2" size="s">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      headerRight: () => (Platform.OS === 'web' ? <HoliHorizontalRow>{filterButton}</HoliHorizontalRow> : filterButton),
    })
  }, [navigate, t, title, isFiltering, showFilterModal, setScreenOptions, styles.dot])

  const ListComponent = discoveryVariant === 'discoveryV1' ? VolunteeringDiscoveryV1 : VolunteeringListing
  const FilterFormComponent =
    discoveryVariant === 'discoveryV1' ? VolunteeringFilterFormDiscoveryV1 : VolunteeringFilterForm

  return (
    <ScrollHeaderLayout
      style={styles.defaultLayout}
      testID="volunteering-list-container"
      keyboardShouldPersistTaps="handled"
    >
      <HoliModal
        show={showFilterModal}
        onDismiss={closeModal}
        testID="volunteering-filter-modal"
        label={t('volunteering:filter.heading')}
        autoHeight={false}
        relativeHeight={1}
      >
        <FilterFormComponent onSubmit={submit} filters={filters} clearFilters={clearFilters} />
      </HoliModal>

      <ListComponent
        filters={filters}
        clearFilters={clearFilters}
        isFiltering={isFiltering}
        loadingFilters={loadingGeolocation}
        loadingFiltersFailed={!!geolocationError}
      />
    </ScrollHeaderLayout>
  )
}

const WrappedVolunteeringAppHome = () => {
  const discoveryV1Toggle = useFeatureFlagToggle(FeatureFlagKey.VOLUNTEERING_DISCOVERY_V1)

  if (discoveryV1Toggle) {
    return <VolunteeringAppHome />
  }

  return (
    <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.VOLUNTEERING} i18nKey="volunteering:maintenance.feature">
      <VolunteeringAppHome />
    </PosthogFeatureFlagGuard>
  )
}

export default memo(WrappedVolunteeringAppHome)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    defaultLayout: {
      backgroundColor: theme.colors.background20,
      paddingBottom: 0,
      minHeight: Platform.OS === 'web' ? ('100vh' as DimensionValue) : ('100%' as DimensionValue),
    },
    dot: {
      backgroundColor: theme.colors.brandColorB30,
      height: 12,
      width: 12,
      borderRadius: 6,
      position: 'absolute',
      top: -2,
      right: -2,
      borderColor: theme.colors.background10,
      borderWidth: 2,
    },
  })
