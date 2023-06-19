import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import type { BottomTabsScreens } from '@holi/mobile/navigation/BottomTabsNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<BottomTabsScreens>

const Search: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const title = t('search.title')
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({ title })
  }, [setScreenOptions, title])

  return (
    <ScrollHeaderLayout.Default>
      <View style={mixins.container}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>
      </View>
    </ScrollHeaderLayout.Default>
  )
}

export default memo(Search)
