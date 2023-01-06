import React, { memo, useCallback, useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationSearchButtons from '@holi/core/navigation/components/NotificationSearchButtons'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import DiscoverSpaces from '@holi/core/screens/spaces/components/DiscoverSpaces'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import SpaceTermContextProvider from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Spaces: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { setOptions, navigate } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const applyFilters = useCallback(
    (filters: SpaceFilter) => {
      const params = new URLSearchParams()
      if (filters.topicSlug) {
        params.set('topic', filters.topicSlug)
      }
      if (filters.location) {
        params.set('location', filters.location)
      }
      filters.skillSlugs?.forEach((skill) => {
        params.append('skill', skill)
      })
      const paramsString = params.toString()
      paramsString && navigate('/spaces/filter?' + paramsString)
    },
    [navigate]
  )
  const { user } = useContext(UserContext)

  useLayoutEffect(() => {
    const title = t('spaces.title')

    setOptions({
      title,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.backgroundColorWhite },
      headerTitle: () => null,
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" widthOfScreen={0.6} tintColor={tintColor}>
          {title}
        </HeaderTitle>
      ),
      headerRight: (props) => <NotificationSearchButtons {...props} />,
    })
  }, [setOptions, navigate, t])

  return (
    <SpaceTermContextProvider>
      <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200} style={styles.wrapper}>
        <DiscoverSpaces style={mixins.container} user={user} />
      </DefaultLayout>
      <SpaceFilterModal applyFilters={applyFilters} />
    </SpaceTermContextProvider>
  )
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundColorGrey,
      minHeight: deviceHeight,
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: 50,
    },
  })

export default memo(Spaces)
