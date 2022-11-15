import { useQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { SpacesResponse, spacesQuery } from '@holi/core/screens/spaces/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const SPACES_PAGE_SIZE = 10

const Spaces: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const title = t('spaces.title')
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()

  useLayoutEffect(() => {
    setOptions({
      title,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
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
  }, [setOptions, navigate, t, title])

  const { loading, data, error } = useQuery<SpacesResponse>(spacesQuery, {
    variables: {
      limit: SPACES_PAGE_SIZE,
      offset: 0,
    },
  })

  const spaces = data?.spaces || []

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
      <View style={mixins.container}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>
        {spaces.map((space) => {
          return (
            <HoliButton key={space.id} label={space.title} onPress={() => navigate(`/spaces/${space.id}`)}>
              <HoliText>{space.title}</HoliText>
            </HoliButton>
          )
        })}
      </View>
    </DefaultLayout>
  )
}

export default memo(Spaces)

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
})
