import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListing from '@holi-apps/donations/components/DonationListing'
import DonationSearchForm from '@holi-apps/donations/components/DonationSearchForm'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const DonationsAppHome: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { t } = useTranslation()
  const title = t('donations:app.name')
  const mixins = useStyleMixins()
  const [showSearchModal, setShowSearchModal] = useState(false)
  const closeModal = useCallback(() => {
    setShowSearchModal(false)
  }, [])
  const [locationQuery, setLocationQuery] = useState('')
  const submitSearch = useCallback(
    (location) => {
      setLocationQuery(location)
      closeModal()
    },
    [setLocationQuery, closeModal]
  )

  useNavigationHeader(navigation, {
    title: title,
    headerLeft: () => <BackButton icon="arrow-down-s" />,
    headerRight: () => (
      <HoliButton label={t('donations:search.heading')} inline transparent onPress={() => setShowSearchModal(true)}>
        <HoliIcon icon="search" size={24} />
      </HoliButton>
    ),
  })

  return (
    <DefaultLayout>
      <HoliModal
        show={showSearchModal}
        onDismiss={closeModal}
        testID="donations-search-modal"
        label={t('donations:search.heading')}
        autoHeight={false}
      >
        <DonationSearchForm onSubmit={submitSearch} locationQuery={locationQuery} />
      </HoliModal>
      <View style={[mixins.container, { paddingTop: 10 }]} testID={'donations-list-container'}>
        <DonationListing locationQuery={locationQuery} />
      </View>
    </DefaultLayout>
  )
}

export default DonationsAppHome
