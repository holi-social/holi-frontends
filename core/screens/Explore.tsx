import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ExploreProps = NativeStackScreenProps<HomeStackScreens>

const Explore: React.VFC<ExploreProps> = ({ navigation }: ExploreProps) => {
  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('explore.title')
  const mixins = useStyleMixins()

  useLayoutEffect(() => {
    setNavigationHeader({
      title: title,
      titleElement: () => (
        <HoliText bold style={{ paddingTop: 5 }}>
          {title}
        </HoliText>
      ),
    })
    return clearNavigationHeader
  }, [navigation, title, setNavigationHeader, clearNavigationHeader])

  return (
    <DefaultLayout>
      <View style={mixins.container}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>
      </View>
    </DefaultLayout>
  )
}

export default Explore
