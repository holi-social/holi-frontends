import { donationsMockData } from 'holi-apps/donations/screens/DonationsAppHome'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type DonationsAppDetailParams = {
  donationId: string
}

const { useParam } = createParam<DonationsAppDetailParams>()

type DonationsAppDetailProps = NativeStackScreenProps<HomeStackScreens>

const DonationsAppDetail: React.VFC<DonationsAppDetailProps> = ({ navigation }: DonationsAppDetailProps) => {
  const [donationId] = useParam('donationId')

  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('apps.donations.detail.title')
  const mixins = useStyleMixins()

  useLayoutEffect(() => {
    setNavigationHeader(title, {
      headerLeft: () => <BackButton />,
    })
    return clearNavigationHeader
  }, [navigation, donationId, title, setNavigationHeader, clearNavigationHeader])

  if (!donationId) return <HoliText>{t('apps.donations.detail.missingDonationId')}</HoliText>

  // TODO (FE): fetch donation from API / using donationsMockData
  const mockData = donationsMockData.find((donation) => donation.id === parseInt(donationId))
  console.log(mockData)

  return (
    <DefaultLayout>
      <View style={[mixins.container, { justifyContent: 'center', padding: 10 }]}>
        <HoliHeading level="1" size="super">
          👋
        </HoliHeading>
      </View>
    </DefaultLayout>
  )
}

export default DonationsAppDetail
