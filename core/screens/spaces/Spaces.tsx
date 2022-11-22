import { useQuery } from '@apollo/client'
import SpacesView from 'core/screens/spaces/components/SpacesView'
import React, { useContext, useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { topicsQuery } from '@holi/core/screens/spaces/queries'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import { TopicsQueryResult } from '@holi/core/screens/userprofile/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Spaces: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { setOptions, navigate } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()

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
      headerRight: ({ tintColor }) => (
        <HoliHorizontalRow>
          <HoliButton label={t('notifications.title')} inline transparent onPress={() => navigate('/notifications')}>
            <HoliIcon icon="notification-2" size={24} color={tintColor} />
          </HoliButton>

          <HoliButton label={t('navigation.search')} inline transparent onPress={() => navigate('/search')}>
            <HoliIcon icon="search" size={24} color={tintColor} />
          </HoliButton>
        </HoliHorizontalRow>
      ),
    })
  }, [setOptions, navigate, t])

  const { loading, data, error } = useQuery<TopicsQueryResult>(topicsQuery)

  const topics = useMemo(() => data?.topics.data || [], [data])

  const { user } = useContext(UserContext)

  if (error) {
    displayError(error, t('spaces.spaceListing.error'))
  }

  if (loading) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('spaces.spaceListing.loading')}</HoliText>
      </View>
    )
  }

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
      <SpacesView style={mixins.container} user={user} topics={topics} />
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
})

export default Spaces
