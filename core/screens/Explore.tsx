import React, { useLayoutEffect } from 'react'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'

type ExploreProps = NativeStackScreenProps<HomeStackScreens>

const Explore: React.VFC<ExploreProps> = ({ navigation }: ExploreProps) => {
  const { setNavigationHeader } = useNavigationHeader()
  const title = 'Explore Holi'

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: title,
        titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
      }),
    [navigation, setNavigationHeader]
  )

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliHeading level="1" size="super">
        Explore
      </HoliHeading>
    </View>
  )
}

export default Explore
