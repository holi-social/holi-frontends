import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Explore: React.VFC<ScreenProps> = ({ navigation }) => {
  const { t } = useTranslation()
  const title = t('explore.title')
  const mixins = useStyleMixins()

  useNavigationHeader(navigation, { title: title })

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

export default memo(Explore)
