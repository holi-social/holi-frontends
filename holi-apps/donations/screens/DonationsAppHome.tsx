import Constants from 'expo-constants'
import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import HoliIcon from '@holi//ui/components/atoms/HoliIcon'
import HoliButton from '@holi//ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi//ui/components/molecules/HoliHorizontalRow'
import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { DonationsAppScreensList } from '@holi/mobile/navigation/DonationsAppNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListing from '@holi-apps/donations/components/DonationListing'
import DonationSearchForm from '@holi-apps/donations/components/DonationSearchForm'

type ScreenProps = NativeStackScreenProps<DonationsAppScreensList>

export type DonationsAppHomeParams = {
  location?: string
}

const { useParam } = createParam<DonationsAppHomeParams>()

const DonationsAppHome: React.VFC<ScreenProps> = () => {
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

  const { setOptions, navigate } = useUnifiedNavigation()

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

    setOptions({
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
  }, [setOptions, navigate, t, title])

  return (
    <DefaultScrollHeaderLayout keyboardShouldPersistTaps="always" headerOverlap>
      <HoliModal
        show={showSearchModal}
        onDismiss={closeModal}
        testID="donations-search"
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
        <DonationListing locationQuery={locationQuery} resetSearch={resetSearch} />
      </View>
    </DefaultScrollHeaderLayout>
  )
}

export default memo(DonationsAppHome)
