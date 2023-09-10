import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import { useGeolocationDetails } from '@holi/core/location/hooks/useGeolocationDetails'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Filter3 } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

import VolunteeringFilterForm from '@holi-apps/volunteering/components/VolunteeringFilterForm'
import VolunteeringListing from '@holi-apps/volunteering/components/VolunteeringListing'
import { VolunteeringFilters } from '@holi-apps/volunteering/types'

const { useParam, useUpdateParams } = createParam<VolunteeringFilters>()

const VolunteeringAppHome = () => {
  const { displayError } = useErrorHandling()

  const { t } = useTranslation()
  const title = t('volunteering:app.name')
  const setScreenOptions = useSetScreenOptions()

  const [showFilterModal, setShowFilterModal] = useState(false)

  const [location] = useParam('location', singleParamConfig)
  const [category] = useParam('category', singleParamConfig)

  const updateParams = useUpdateParams()

  const { geolocationDetails, geolocationError } = useGeolocationDetails(location)
  const initialLocationSelection = useMemo<GeolocationSuggestion | undefined>(() => {
    return (
      geolocationDetails && {
        ...geolocationDetails,
        label: geolocationDetails.name,
      }
    )
  }, [geolocationDetails])

  const closeModal = useCallback(() => {
    setShowFilterModal(false)
  }, [])

  const submit = useCallback(
    (filters?: VolunteeringFilters) => {
      updateParams({ location: filters?.location, category: filters?.category })
      closeModal()
    },
    [updateParams, closeModal]
  )

  const clearFilters = useCallback(
    () =>
      updateParams({
        location: undefined,
        category: undefined,
      }),
    [updateParams]
  )

  const { navigate } = useRouting()
  const filters = { location: initialLocationSelection, category }

  const isFiltering = !!(location || category)

  useLayoutEffect(() => {
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
        <HoliHeading level="1" size="small">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      headerRight: () => (Platform.OS === 'web' ? <HoliHorizontalRow>{filterButton}</HoliHorizontalRow> : filterButton),
    })
  }, [navigate, t, title, isFiltering, showFilterModal, setScreenOptions])

  useEffect(() => {
    if (geolocationError) {
      displayError(geolocationError, t('volunteering:listing.error'))
    }
  }, [displayError, geolocationError, t])

  if (geolocationError) {
    return <></>
  }

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
          <VolunteeringFilterForm onSubmit={submit} filters={filters} />
        </HoliModal>

        <VolunteeringListing filters={filters} clearFilters={clearFilters} />
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

const styles = StyleSheet.create({
  defaultLayout: {
    backgroundColor: colors.background20,
    paddingBottom: 0,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  dot: {
    backgroundColor: colors.brandColorB30,
    height: 12,
    width: 12,
    borderRadius: 6,
    position: 'absolute',
    top: -2,
    right: -2,
    borderColor: colors.background10,
    borderWidth: 2,
  },
})
