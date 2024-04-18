import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks, { singleParamConfig, webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Filter3 } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { SafeAreaProvider } from '@holi/ui/components/atoms/SafeAreaProvider'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import VolunteeringFilterForm from '@holi-apps/volunteering/components/VolunteeringFilterForm'
import VolunteeringListing from '@holi-apps/volunteering/components/VolunteeringListing'
import { VolunteeringFilterParams, VolunteeringFilters } from '@holi-apps/volunteering/types'

const { useParam, useUpdateParams } = createParamHooks<VolunteeringFilterParams>()

const VolunteeringAppHome = () => {
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const title = t('volunteering:app.name')
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const [showFilterModal, setShowFilterModal] = useState(false)

  const [location] = useParam('location', singleParamConfig)
  const [category] = useParam('category', singleParamConfig)
  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const { geolocationDetails, geolocationError, loadingGeolocation } = useGeolocationDetails(location)
  const initialLocationSelection = useMemo<GeolocationSuggestion | undefined>(() => {
    return (
      geolocationDetails && {
        ...geolocationDetails,
        label: geolocationDetails.name,
      }
    )
  }, [geolocationDetails])
  const [filters, setFilters] = useState({ location: initialLocationSelection, category })
  const loadingFilters = loadingGeolocation || (!!location && !geolocationDetails && !geolocationError)
  const isFiltering = !!(location || category)

  const closeModal = useCallback(() => {
    setShowFilterModal(false)
  }, [])

  const submit = useCallback(
    (filters?: VolunteeringFilters) => {
      setFilters({ location: filters?.location, category: filters?.category })
      updateParams({ location: filters?.location?.id, category: filters?.category })
      closeModal()
    },
    [updateParams, closeModal]
  )

  const clearParamsFromUrl = useCallback(
    () =>
      updateParams({
        location: undefined,
        category: undefined,
      }),
    [updateParams]
  )

  const clearFilters = useCallback(() => {
    setFilters({ location: undefined, category: undefined })
    clearParamsFromUrl()
  }, [clearParamsFromUrl])

  useEffect(() => {
    if (loadingFilters) {
      return
    }
    if (geolocationDetails || category) {
      setFilters({
        location: geolocationDetails && {
          ...geolocationDetails,
          label: geolocationDetails.name,
        },
        category,
      })
    } else {
      setFilters({ location: undefined, category: undefined })
    }
  }, [location, category, geolocationDetails, loadingGeolocation, loadingFilters])

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
        <HoliHeading level="1" size="s">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      headerRight: () => (Platform.OS === 'web' ? <HoliHorizontalRow>{filterButton}</HoliHorizontalRow> : filterButton),
    })
  }, [navigate, t, title, isFiltering, showFilterModal, setScreenOptions, colors.background10, styles.dot])

  useEffect(() => {
    if (geolocationError) {
      displayError(geolocationError, 'Failed to load geolocation details', {
        displayMessage: t('volunteering:listing.error'),
        location: 'VolunteeringAppHome.useEffect',
        locationId: location,
      })
    }
  }, [displayError, geolocationError, location, t])

  return (
    <SafeAreaProvider>
      <DefaultLayout
        style={styles.defaultLayout}
        scrollable={true}
        testID={'volunteering-list-container'}
        keyboardShouldPersistTaps="handled"
        hasFooterTabBar={false}
      >
        <HoliModal
          show={showFilterModal}
          onDismiss={closeModal}
          testID="volunteering-filter-modal"
          label={t('volunteering:filter.heading')}
          autoHeight={false}
          relativeHeight={1}
        >
          <VolunteeringFilterForm
            onSubmit={submit}
            filters={filters}
            clearFilters={clearFilters}
            initialLocationSelection={initialLocationSelection}
          />
        </HoliModal>

        <VolunteeringListing
          filters={filters}
          clearFilters={clearFilters}
          isFiltering={isFiltering}
          loadingFilters={loadingFilters}
          filterError={!!geolocationError}
        />
      </DefaultLayout>
    </SafeAreaProvider>
  )
}

const WrappedVolunteeringAppHome = () => (
  <FeatureToggleGuard
    toggleName={FeatureToggleName.APPS_VOLUNTEERING}
    featureNameKey="volunteering:maintenance.feature"
  >
    <VolunteeringAppHome />
  </FeatureToggleGuard>
)

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
