import React, { useEffect, useLayoutEffect } from 'react'
import { View } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/context'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export const SearchScreen: React.FC = ({ navigation }) => {
  const navigationContext = useNavigationContext()
  useEffect(() => navigationContext.setHeaderTitle('Search Results'))

  navigation &&
    useLayoutEffect(
      () =>
        navigation.setOptions({
          headerTitle: () => (
            <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
              Search Results
            </HoliText>
          ),
        }),
      [navigation]
    )

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliHeading level={1}>Search</HoliHeading>
    </View>
  )
}
