import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useTheme } from '@holi/ui/styles/theme'

type VolunteeringAppHomeProps = NativeStackScreenProps<HomeStackScreens>

const VolunteeringAppHome: React.VFC<VolunteeringAppHomeProps> = ({ navigation }: VolunteeringAppHomeProps) => {
  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('apps.volunteering.name')
  const { theme } = useTheme()

  useLayoutEffect(
    () => {
      setNavigationHeader({
        title: title,
        titleElement: () => (
          <HoliText bold style={{ paddingTop: 5 }}>
            {title}
          </HoliText>
        ),
      })
      return clearNavigationHeader
    },
    // setNavigationHeader would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation, title]
  )

  return (
    <View style={[theme.mixins.container, { padding: 10 }]}>
      <HoliHeading level="1" size="super" testID="apps-volunteering-heading">
        {title}
      </HoliHeading>
    </View>
  )
}

export default VolunteeringAppHome
