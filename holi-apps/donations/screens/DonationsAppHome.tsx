import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import HoliIcon from '@holi//ui/components/atoms/HoliIcon'
import HoliButton from '@holi//ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi//ui/components/molecules/HoliHorizontalRow'
import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListing from '@holi-apps/donations/components/DonationListing'
import DonationSearchForm from '@holi-apps/donations/components/DonationSearchForm'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

export type DonationsAppHomeParams = {
  location?: string
}

const { useParam } = createParam<DonationsAppHomeParams>()

const DonationsAppHome: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const title = t('donations:app.name')
  const mixins = useStyleMixins()
  const { height: deviceHeight } = useWindowDimensions()
  const [showSearchModal, setShowSearchModal] = useState(false)
  const closeModal = useCallback(() => {
    setShowSearchModal(false)
  }, [])
  const [locationQuery, setLocationQuery] = useParam('location')
  const submitSearch = useCallback(
    (location) => {
      setLocationQuery(location)
      closeModal()
    },
    [setLocationQuery, closeModal]
  )
  const onScreenScroll = useScrollYHandler()
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
        <HoliIcon icon="search-2" size={24} />
      </HoliButton>
    )

    setOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.backgroundColorWhite },
      headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
      headerRight: ({ tintColor }) =>
        Platform.OS === 'web' ? (
          <HoliHorizontalRow>
            {searchButton}
            <HeaderBackButton icon="close" tintColor={tintColor} />
          </HoliHorizontalRow>
        ) : (
          <>{searchButton}</>
        ),
    })
  }, [setOptions, navigate, t, title])

  return (
    <DefaultLayout keyboardShouldPersistTaps="always" onScroll={onScreenScroll} scrollEventThrottle={200}>
      <HoliModal
        show={showSearchModal}
        onDismiss={closeModal}
        testID="donations-search-modal"
        label={t('donations:search.heading')}
        autoHeight={false}
        // Smaller devides use the whole screen and
        // larger ones should have more space above for clicking the backdrop pane
        relativeHeight={deviceHeight > 750 ? 0.85 : 100}
      >
        <DonationSearchForm onSubmit={submitSearch} locationQuery={locationQuery} />
      </HoliModal>
      <View style={[mixins.container, { paddingTop: 10 }]} testID={'donations-list-container'}>
        <DonationListing locationQuery={locationQuery} resetSearch={resetSearch} />
      </View>
    </DefaultLayout>
  )
}

export default memo(DonationsAppHome)
