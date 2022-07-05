import React, { useLayoutEffect } from 'react'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

type SearchProps = NativeStackScreenProps<HomeStackScreens>

const Search: React.VFC<SearchProps> = ({ navigation }: SearchProps) => {
  const { setNavigationHeader } = useNavigationHeader()
  const title = 'Search Result'

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
    [navigation, setNavigationHeader]
  )

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliText type={HoliTextType.super}>Search</HoliText>
    </View>
  )
}

export default Search
