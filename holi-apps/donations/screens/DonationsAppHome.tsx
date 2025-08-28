import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Platform, View, useWindowDimensions } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks, { webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListingContainer from '@holi-apps/donations/components/DonationListingContainer'
import DonationSearchForm from '@holi-apps/donations/components/DonationSearchForm'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'

export type DonationsAppHomeParams = {
  location?: string
}

const { useParam, useUpdateParams } = createParamHooks<DonationsAppHomeParams>()

const DonationsAppHome = () => {
  const { t } = useTranslation()
  const title = t('donations.app.name')
  const mixins = useStyleMixins()
  const { height: deviceHeight } = useWindowDimensions()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [showSearchModal, setShowSearchModal] = useState(false)
  const closeModal = useCallback(() => {
    setShowSearchModal(false)
  }, [])
  const [locationQuery] = useParam('location')
  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const submitSearch = useCallback(
    (location?: string) => {
      updateParams({ location })
      closeModal()
    },
    [updateParams, closeModal]
  )
  const resetSearch = useCallback(() => {
    updateParams({ location: undefined })
    closeModal()
  }, [updateParams, closeModal])

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    // Filtering is disabled, because we can no longer filter by location on the Betterplace API.
    // https://holi.atlassian.net/browse/HOLI-9717
    // Can be re-enabled when we use the donations from our own DB. Please remember to also re-enable the e2e test web and mobile!
    // const searchButton = (
    //   <HoliButton
    //     label={t('donations.search.heading')}
    //     inline
    //     transparent
    //     onPress={() => setShowSearchModal(true)}
    //     testID="donations-search-button"
    //   >
    //     <HoliIcon icon={Filter3} />
    //   </HoliButton>
    // )

    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="2" size="s">
          {title}
        </HoliHeading>
      ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
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
          <DonationSearchForm onSubmit={submitSearch} locationQuery={locationQuery} />
        </HoliModal>
        <View style={[mixins.container]} testID={'donations-list-container'}>
          <DonationListingContainer locationQuery={locationQuery} resetSearch={resetSearch} />
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
