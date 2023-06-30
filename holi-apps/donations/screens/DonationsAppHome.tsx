import Constants from 'expo-constants'
import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View, useWindowDimensions } from 'react-native'

import HoliIcon from '@holi//ui/components/atoms/HoliIcon'
import HoliButton from '@holi//ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi//ui/components/molecules/HoliHorizontalRow'
import client from '@holi/api/graphql/client'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListingContainer from '@holi-apps/donations/components/DonationListingContainer'
import DonationSearchForm from '@holi-apps/donations/components/DonationSearchForm'
import { projectsQuery } from '@holi-apps/donations/queries'

export type DonationsAppHomeParams = {
  location?: string
}

const { useParam } = createParam<DonationsAppHomeParams>()

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
  const [locationQuery, setLocationQuery] = useParam('location')
  const submitSearch = useCallback(
    (location?: string) => {
      setLocationQuery(location)
      closeModal()
    },
    [setLocationQuery, closeModal]
  )
  const resetSearch = useCallback(() => {
    setLocationQuery(undefined)
    closeModal()
  }, [setLocationQuery, closeModal])

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const { refreshing, onRefresh } = useOnRefresh(() => client.refetchQueries({ include: [projectsQuery] }))

  useLayoutEffect(() => {
    const searchButton = (
      <HoliButton
        label={t('donations:search.heading')}
        inline
        transparent
        onPress={() => setShowSearchModal(true)}
        testID="donations-search-button"
      >
        <HoliIcon icon="filter-3" size={24} />
      </HoliButton>
    )

    setScreenOptions({
      navigationCustomOptions: {
        footerShown: false,
      },
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerLeft: ({ tintColor }) => <HeaderBackButton icon="arrow-down-s" tintColor={tintColor} />,
      headerRight: () =>
        Platform.OS === 'web' ? <HoliHorizontalRow>{searchButton}</HoliHorizontalRow> : <>{searchButton}</>,
    })
  }, [navigate, setScreenOptions, t, title])

  return (
    <ScrollHeaderLayout.Refreshable
      refreshableProps={{ isLoading: refreshing, onRefresh }}
      keyboardShouldPersistTaps="always"
      headerOverlap
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
        style={[mixins.container, { paddingTop: statusBarHeight + vars.topBarHeight }]}
        testID={'donations-list-container'}
      >
        <DonationListingContainer locationQuery={locationQuery} resetSearch={resetSearch} />
      </View>
    </ScrollHeaderLayout.Refreshable>
  )
}

export default memo(DonationsAppHome)
