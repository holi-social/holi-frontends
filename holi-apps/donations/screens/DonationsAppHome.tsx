import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListing from '@holi-apps/donations/components/DonationListing'

type DonationsAppHomeProps = NativeStackScreenProps<HomeStackScreens>

const DonationsAppHome: React.VFC<DonationsAppHomeProps> = ({ navigation }: DonationsAppHomeProps) => {
  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('apps.donations.name')
  const mixins = useStyleMixins()

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
      <DonationListing />
    </View>
  )
}

export default DonationsAppHome
