import { useQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StatusBar, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import SpaceDetailView from '@holi/core/screens/spaces/components/SpaceDetailView'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceDetailsParams = {
  spaceId: string
}

const { useParam } = createParam<SpaceDetailsParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const SpaceDetails: React.VFC<ScreenProps> = () => {
  const [spaceId] = useParam('spaceId')

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const onScreenScroll = useScrollYHandler()

  const { setOptions } = useUnifiedNavigation()

  useLayoutEffect(() => {
    setOptions({
      animation: 'slide_from_bottom',
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTitle: () => null,
      headerLeft: () =>
        Platform.OS === 'web' ? <HeaderBackButton icon="arrow-left-s" /> : <HeaderBackButton icon="arrow-down-s" />,
      headerRight: () => <HeaderBackButton icon="more" />,
    })
  }, [setOptions])

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { id: spaceId },
  })

  const space = data?.spaceById

  if (error) {
    logError(error, `[SpaceDetails.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  if (!space) return <HoliText>{t('spaces.spaceDetails.notFound', { spaceId })}</HoliText>

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200} style={styles.defaultLayout}>
      <SpaceDetailView style={[mixins.container, styles.spaceDetailView]} space={space} />
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 8,
  },
  spaceDetailView: {
    paddingTop: 0,
  },
})

export default memo(SpaceDetails)
