import * as React from 'react'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const SettingsOverview: React.VFC<ScreenProps> = ({ navigation }) => {
  const { navigate } = useRouting()

  useNavigationHeader(navigation, { title: 'Settings', headerLeft: () => <BackButton /> })

  return (
    <>
      <HoliHeading>Settings Overview</HoliHeading>

      <HoliButton label={''} inline onPress={() => navigate('/profile/settings/account')} transparent>
        account settings
      </HoliButton>
    </>
  )
}

export default SettingsOverview
