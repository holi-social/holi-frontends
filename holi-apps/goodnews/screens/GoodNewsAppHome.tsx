import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import GoodNewsListing from '@holi-apps/goodnews/components/GoodNewsListing'

type GoodNewsAppHomeProps = Record<string, never>

const GoodNewsAppHome: React.VFC<GoodNewsAppHomeProps> = () => {
  const { t } = useTranslation()
  const title = t('goodnews:app.name')
  const mixins = useStyleMixins()

  const { setOptions, navigate } = useUnifiedNavigation()

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.backgroundColorWhite },
      headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
      headerRight: ({ tintColor }) =>
        Platform.OS === 'web' ? (
          <HoliHorizontalRow>
            <HeaderBackButton icon="close" tintColor={tintColor} />
          </HoliHorizontalRow>
        ) : undefined,
    })
  }, [setOptions, navigate, t, title])

  return (
    <DefaultLayout>
      <View style={[mixins.container, { paddingTop: 10 }]} testID={'goodnews-list-container'}>
        <HoliText size={'extralarge'}>{title}</HoliText>
        <GoodNewsListing />
      </View>
    </DefaultLayout>
  )
}

export default memo(GoodNewsAppHome)
