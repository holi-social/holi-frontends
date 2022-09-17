import { useQuery } from '@apollo/client'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

// ToDo (konrad): check and adjust this implementation after team feedback
// eslint-disable-next-line no-restricted-imports
import DonationListing from '../components/DonationListing'
import { DonationAppsResponse, donationAppsProjectsQuery } from './queries'

type DonationsAppHomeProps = NativeStackScreenProps<HomeStackScreens>

/*
 * DEMO MOCK CODE START
 */

export const donationsMockData: Project[] = [
  {
    id: 12345,
    title: 'Pakistan: Nothilfe nach Überschwemmungen',
    category: 'Climate',
    donationsCount: 130,
    progressPercentage: 50,
    openAmountInCents: 1477901,
    picture: [
      {
        url: 'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/112/765/fill_618x322_bp1661777467_pakistan-nothilfe-flut_066_1008.jpg',
        type: 'original',
      },
    ],
  },
  {
    id: 12346,
    title: 'Nothilfe Ukraine',
    category: 'Climate',
    donationsCount: 6816,
    progressPercentage: 97,
    openAmountInCents: 75836400,
    picture: [
      {
        url: 'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/106/501/fill_618x322_bp1658423152_DRK_YouTube_KatKit_Titelbild_Youtube.png',
        type: 'original',
      },
    ],
  },
  {
    id: 12347,
    title: 'Hilfe für das Berliner Tierheim! Mehr als 1.300 Tiere brauchen Euch!',
    category: 'Kittens',
    donationsCount: 3780,
    progressPercentage: 94,
    openAmountInCents: 67229796,
    picture: [
      {
        url: 'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/058/391/limit_1240x646_bp1658358248_9R0A1226_-_Kopie.jpg',
        type: 'original',
      },
    ],
  },
  {
    id: 12348,
    title: 'Jetzt Wasserprojekte weltweit unterstützen!',
    category: 'Environment',
    donationsCount: 28359,
    progressPercentage: 97,
    openAmountInCents: 151838026,
    picture: [
      {
        url: 'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/024/394/limit_1240x646_bp1658241002_Wasser_fu%CC%88r_alle.jpg',
        type: 'original',
      },
    ],
  },
  {
    id: 12349,
    title: 'Unsere Inklusions-Kita vor dem AUS! Wir brauchen EURE Hilfe!',
    category: 'Children',
    donationsCount: 881,
    progressPercentage: 90,
    openAmountInCents: 3287500,
    picture: [
      {
        url: 'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/103/416/limit_1240x646_bp1661435367_keyvisual_3x2.png',
        type: 'original',
      },
    ],
  },
]
/*
 * DEMO MOCK CODE END
 */

const DonationsAppHome: React.VFC<DonationsAppHomeProps> = ({ navigation }: DonationsAppHomeProps) => {
  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('apps.donations.name')
  const mixins = useStyleMixins()

  // TODO - manage offset state
  const { loading, error, data } = useQuery<DonationAppsResponse>(donationAppsProjectsQuery, {
    variables: { locale: 'en', limit: 5, offset: 0 },
  })
  console.log(loading, error, data)

  useLayoutEffect(
    () => {
      setNavigationHeader(title)
      return clearNavigationHeader
    },
    // setNavigationHeader would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation, title]
  )

  return (
    <View style={[mixins.container, { padding: 10 }]}>
      <HoliHeading level="1" size="super" testID="apps-donations-heading">
        {title}
      </HoliHeading>
      <DonationListing data={donationsMockData} />
    </View>
  )
}

export default DonationsAppHome
