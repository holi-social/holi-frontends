import React, { useLayoutEffect } from 'react'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

type ExploreProps = NativeStackScreenProps<HomeStackScreens>

const Explore: React.VFC<ExploreProps> = ({ navigation }: ExploreProps) => {
  const { setNavigationHeader } = useNavigationHeader()
  const title = 'Explore Holi'

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: title,
        titleElement: () => (
          <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
            {title}
          </HoliText>
        ),
      }),
    [navigation]
  )

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliText type={HoliTextType.super}>Explore</HoliText>
    </View>
  )
}

export default Explore
