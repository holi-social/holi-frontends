import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'

type ExploreProps = NativeStackScreenProps<HomeStackScreens>

const Explore: React.VFC<ExploreProps> = ({ navigation }: ExploreProps) => {
  const { setNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('explore.title')

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: title,
        titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
      }),
    [navigation]
  )

  return (
    <DefaultLayout>
      <HoliHeading level="1" size="super">
        {title}
      </HoliHeading>
    </DefaultLayout>
  )
}

export default Explore
