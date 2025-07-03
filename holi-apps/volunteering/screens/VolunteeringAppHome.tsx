import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Platform, StyleSheet } from 'react-native'

import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Filter3 } from '@holi/icons/src/generated'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { VolunteeringFilterForm } from '@holi-apps/volunteering/components/VolunteeringFilterForm'
import VolunteeringListingDiscovery from '@holi-apps/volunteering/components/VolunteeringListingDiscovery'
import { useVolunteeringFilters } from '@holi-apps/volunteering/hooks/useVolunteeringFilters'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import { Text } from 'holi-bricks/components/text'
import { VolunteeringFilterRow } from '@holi-apps/volunteering/components/VolunteeringFilterRow'

const VolunteeringAppHome = () => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const title = t('volunteering.app.name')
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { onScroll: onScreenScroll } = useThrottledMobileScrollEvents()

  const [filterModalShown, setFilterModalShown] = useState(false)
  const closeModal = useCallback(() => {
    setFilterModalShown(false)
  }, [])

  const { submit, filters, clearFilters, isFiltering, loadingGeolocation, geolocationError } =
    useVolunteeringFilters(closeModal)

  useIsomorphicLayoutEffect(() => {
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
    setScreenOptions({
      headerTitle: () => (
        <Text headingLevel="2" size="lg">
          {title}
        </Text>
      ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      headerRight: () => (Platform.OS === 'web' ? <HoliHorizontalRow>{filterButton}</HoliHorizontalRow> : filterButton),
    })
  }, [navigate, t, title, isFiltering, filterModalShown, setScreenOptions, styles.dot])

  return (
    <ScrollViewRefreshable
      style={styles.defaultLayout}
      testID="volunteering-list-container"
      keyboardShouldPersistTaps="handled"
      onScroll={onScreenScroll}
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

      <VolunteeringFilterRow onSubmit={() => {}} filters={filters} />

      <VolunteeringListingDiscovery
        filters={filters}
        clearFilters={clearFilters}
        isFiltering={isFiltering}
        loadingFilters={loadingGeolocation}
        loadingFiltersFailed={!!geolocationError}
      />
    </ScrollViewRefreshable>
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
