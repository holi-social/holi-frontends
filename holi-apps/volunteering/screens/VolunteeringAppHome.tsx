import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'

type VolunteeringAppHomeProps = NativeStackScreenProps<HomeStackScreens>

const VolunteeringAppHome: React.VFC<VolunteeringAppHomeProps> = ({ navigation }: VolunteeringAppHomeProps) => {
  const { setNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('apps.volunteering.name')

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: title,
        titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
      }),
    [navigation, setNavigationHeader, title]
  )

  return (
    <View style={{ padding: 10 }}>
      <HoliHeading level="1" size="super" testID="apps-volunteering-title">
        {title}
      </HoliHeading>
    </View>
  )
}

export default VolunteeringAppHome
