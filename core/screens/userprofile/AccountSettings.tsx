import * as React from 'react'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
// import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const AccountSettings: React.VFC<ScreenProps> = ({ navigation }) => {
  // const { navigate } = useRouting()

  useNavigationHeader(navigation, { title: 'My Account', headerLeft: () => <BackButton /> })

  return (
    <>
      <HoliHeading>Account Settings</HoliHeading>
    </>
  )
}

export default AccountSettings
