import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks, { webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { DonationListingContainer } from '@holi-apps/donations/components/DonationListingContainer'
import DonationSearchForm from '@holi-apps/donations/components/DonationSearchForm'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Filter3 } from '@holi/icons/src/generated'
import { useGeolocationDetailsWithSuggestion } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

export type DonationsAppHomeParams = {
  geolocationId?: string
}

const { useParam, useUpdateParams } = createParamHooks<DonationsAppHomeParams>()

const DonationsAppHome = () => {
  const { t } = useTranslation()
  const title = t('donations.app.name')
  const mixins = useStyleMixins()
  const { height: deviceHeight } = useWindowDimensions()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { displayError } = useErrorHandling()

  const [showSearchModal, setShowSearchModal] = useState(false)
  const closeModal = useCallback(() => {
    setShowSearchModal(false)
  }, [])
  const [geolocationId] = useParam('geolocationId')
  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const geolocationProps = useGeolocationDetailsWithSuggestion(geolocationId, (error) =>
    displayError(error, 'Failed to load geolocation details', {
      displayMessage: t('donations.donationListing.error'),
      location: 'DonationsAppHome.useGeolocationDetailsWithSuggestion',
      geolocationId,
    })
  )
  const [selectedLocation, setSelectedLocation] = useState(geolocationProps.geolocationSuggestion)

  const onSelectLocation = useCallback(
    (location?: GeolocationSuggestion) => {
      updateParams({ geolocationId: location?.id })
      setSelectedLocation(location)
      closeModal()
    },
    [updateParams, closeModal]
  )

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    // https://holi.atlassian.net/browse/HOLI-9717
    // TODO: Re-enable the e2e test web and mobile!
    const searchButton = (
      <HoliButton
        label={t('donations.search.heading')}
        inline
        transparent
        onPress={() => setShowSearchModal(true)}
        testID="donations-search-button"
      >
        <HoliIcon icon={Filter3} />
      </HoliButton>
    )

    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="2" size="s">
          {title}
        </HoliHeading>
      ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      headerRight: () => searchButton,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [navigate, setScreenOptions, t, title])

  return (
    <>
      <ScrollViewRefreshable style={styles.defaultLayout} keyboardShouldPersistTaps="always">
        <HoliModal
          shown={showSearchModal}
          onDismiss={closeModal}
          testID="donations-search-modal"
          label={t('donations.search.heading')}
          autoHeight={false}
          // Smaller devides use the whole screen and
          // larger ones should have more space above for clicking the backdrop pane
          relativeHeight={deviceHeight > 750 ? 0.85 : 1}
        >
          <DonationSearchForm selectedLocation={selectedLocation} onSelectLocation={onSelectLocation} />
        </HoliModal>
        <View style={[mixins.container]} testID={'donations-list-container'}>
          <DonationListingContainer
            loadingGeolocation={geolocationProps.loadingGeolocation}
            selectedLocation={selectedLocation}
            resetSearch={() => setSelectedLocation(undefined)}
          />
        </View>
      </ScrollViewRefreshable>
    </>
  )
}

const WrappedDonationsAppHome = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.DONATIONS} i18nKey="donations.maintenance.feature">
    <DonationsAppHome />
  </PosthogFeatureFlagGuard>
)

export default memo(WrappedDonationsAppHome)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    defaultLayout: {
      backgroundColor: theme.colors.background20,
      paddingBottom: 0,
      minHeight: Platform.OS === 'web' ? ('100vh' as DimensionValue) : ('100%' as DimensionValue),
    },
  })
