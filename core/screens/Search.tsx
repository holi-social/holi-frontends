import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'

type SearchProps = NativeStackScreenProps<HomeStackScreens>

const Search: React.VFC<SearchProps> = ({ navigation }: SearchProps) => {
  const { setNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('search.title')

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

export default Search
