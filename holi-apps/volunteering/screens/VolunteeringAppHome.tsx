import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const VolunteeringAppHome: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { t } = useTranslation()
  const title = t('apps.volunteering.name')
  const mixins = useStyleMixins()

  useNavigationHeader(navigation, { title: title })

  return (
    <View style={[mixins.container, { padding: 10 }]}>
      <HoliHeading level="1" size="super" testID="apps-volunteering-heading">
        {title}
      </HoliHeading>
    </View>
  )
}

export default VolunteeringAppHome
