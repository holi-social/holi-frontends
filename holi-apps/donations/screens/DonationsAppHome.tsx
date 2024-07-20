import { useApolloClient } from '@apollo/client'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import PosthogFeatureFlagGuard from '@holi/core/components/PosthogFeatureFlagGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { FeatureFlagKey } from '@holi/core/helpers/useFeatureFlag.common'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks, { webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Filter3 } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { constants, dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
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
  const statusBarHeight = constants.statusBarHeight
  const { theme } = useTheme()
  const { colors } = theme
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
  const client = useApolloClient()

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
        <HoliHeading level="2" size="s">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      headerRight: () =>
        Platform.OS === 'web' ? <HoliHorizontalRow>{searchButton}</HoliHorizontalRow> : <>{searchButton}</>,
    })
  }, [navigate, setScreenOptions, t, title, colors.background10])

  return (
    <>
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
    </>
  )
}

const WrappedDonationsAppHome = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.DONATIONS} i18nKey="donations:maintenance.feature">
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
