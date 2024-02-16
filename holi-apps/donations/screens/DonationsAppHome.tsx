import Constants from 'expo-constants'
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import HoliButton from '@holi//ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi//ui/components/molecules/HoliHorizontalRow'
import client from '@holi/api/graphql/client'
import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks, { webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Filter3 } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListingContainer from '@holi-apps/donations/components/DonationListingContainer'
import DonationSearchForm from '@holi-apps/donations/components/DonationSearchForm'
import { donationProjectsQuery } from '@holi-apps/donations/queries'

export type DonationsAppHomeParams = {
  location?: string
}

const { useParam, useUpdateParams } = createParamHooks<DonationsAppHomeParams>()

const DonationsAppHome = () => {
  const { t } = useTranslation()
  const title = t('donations:app.name')
  const mixins = useStyleMixins()
  const { height: deviceHeight } = useWindowDimensions()
  const statusBarHeight = Constants.statusBarHeight
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

  const { refreshing, onRefresh } = useOnRefresh(() => client.refetchQueries({ include: [donationProjectsQuery] }))

  useIsomorphicLayoutEffect(() => {
    const searchButton = (
      <HoliButton
        label={t('donations:search.heading')}
        inline
        transparent
        onPress={() => setShowSearchModal(true)}
        testID="donations-search-button"
      >
        <HoliIcon icon={Filter3} />
      </HoliButton>
    )

    setScreenOptions({
      navigationCustomOptions: {
        footerShown: false,
      },
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      headerRight: () =>
        Platform.OS === 'web' ? <HoliHorizontalRow>{searchButton}</HoliHorizontalRow> : <>{searchButton}</>,
    })
  }, [navigate, setScreenOptions, t, title])

  return (
    <ScrollHeaderLayout.Refreshable
      refreshableProps={{ refreshing, onRefresh }}
      keyboardShouldPersistTaps="always"
      headerOverlap
      style={styles.defaultLayout}
    >
      <HoliModal
        show={showSearchModal}
        onDismiss={closeModal}
        testID="donations-search-modal"
        label={t('donations:search.heading')}
        autoHeight={false}
        // Smaller devides use the whole screen and
        // larger ones should have more space above for clicking the backdrop pane
        relativeHeight={deviceHeight > 750 ? 0.85 : 1}
      >
        <DonationSearchForm onSubmit={submitSearch} locationQuery={locationQuery} />
      </HoliModal>
      <View
        style={[mixins.container, { paddingTop: statusBarHeight + dimensions.topBarHeight }]}
        testID={'donations-list-container'}
      >
        <DonationListingContainer locationQuery={locationQuery} resetSearch={resetSearch} />
      </View>
    </ScrollHeaderLayout.Refreshable>
  )
}

const WrappedDonationsAppHome = () => (
  <FeatureToggleGuard toggleName={FeatureToggleName.APPS_DONATIONS} featureNameKey="donations:maintenance.feature">
    <DonationsAppHome />
  </FeatureToggleGuard>
)

export default memo(WrappedDonationsAppHome)

const styles = StyleSheet.create({
  defaultLayout: {
    backgroundColor: colors.background20,
    paddingBottom: 0,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
})
