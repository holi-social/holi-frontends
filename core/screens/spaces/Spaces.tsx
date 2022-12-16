import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import { topicsQuery } from '@holi/core/screens/spaces/queries'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import { SkillsQueryResult, TopicsQueryResult, skillsQuery } from '@holi/core/screens/userprofile/queries'
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
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const applyFilters = useCallback(
    (filters: SpaceFilter) => {
      const params = new URLSearchParams()
      if (filters.topicId) {
        params.set('topicId', filters.topicId)
      }
      if (filters.location) {
        params.set('location', filters.location)
      }
      filters.skillIds?.forEach((skillId) => {
        params.append('skillId', skillId)
      })
      const paramsString = params.toString()
      paramsString && navigate('/spaces/filter?' + paramsString)
    },
    [navigate]
  )
  const { user } = useContext(UserContext)

  const { loading, data: topicsData, error: topicsError } = useQuery<TopicsQueryResult>(topicsQuery)
  const topics = topicsData?.topics.data || []

  const { data: skillsData, error: skillsError } = useQuery<SkillsQueryResult>(skillsQuery)
  const skills = skillsData?.skills.data || []

  const combinedError = topicsError || skillsError
  if (combinedError) {
    displayError(combinedError, t('spaces.spaceListing.error'))
  }

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

  return (
    <>
      <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200} style={styles.wrapper}>
        {loading ? (
          // TODO: replace with proper loading indicator
          <View style={[mixins.container, styles.messageContainer]}>
            <HoliText>{t('spaces.spaceListing.loading')}</HoliText>
          </View>
        ) : (
          <DiscoverSpacesView style={mixins.container} user={user} topics={topics} />
        )}
      </DefaultLayout>
      <SpaceFilterModal applyFilters={applyFilters} topics={topics} skills={skills} />
    </>
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
