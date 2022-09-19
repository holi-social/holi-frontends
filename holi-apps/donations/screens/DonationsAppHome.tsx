import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListing from '@holi-apps/donations/components/DonationListing'

type DonationsAppHomeProps = NativeStackScreenProps<HomeStackScreens>

const DonationsAppHome: React.VFC<DonationsAppHomeProps> = ({ navigation }: DonationsAppHomeProps) => {
  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('donations:app.name')
  const mixins = useStyleMixins()
  const { navigate } = useRouting()

  useLayoutEffect(() => {
    setNavigationHeader(title, {
      headerLeft: () => <BackButton icon="arrow-down-s" />,
      headerRight: () => (
        <HoliButton label={t('navigation.search')} inline transparent onPress={() => navigate('/search')}>
          <HoliIcon icon="search" size={24} />
        </HoliButton>
      ),
    })
    return clearNavigationHeader
  }, [t, navigation, title, setNavigationHeader, clearNavigationHeader, navigate])

  return (
    <View style={[mixins.container, { padding: 10 }]}>
      <DonationListing />
    </View>
  )
}

export default DonationsAppHome
