import { useQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import TopicSlider from '@holi/core/screens/spaces/components/TopicSlider'
import {
  FilteredSpacesResponse,
  SpacesResponse, // filteredSpacesQuery,
  spacesQuery,
} from '@holi/core/screens/spaces/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const MockDefault: FilteredSpacesResponse = {
  filter: {
    topics: ['All'],
    location: 'Berlin',
  },
  matchedSpaces: [],
  unmatchedSpaces: [],
}

const SPACES_PAGE_SIZE = 10

const Spaces: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [mockData, setMockData] = useState<FilteredSpacesResponse>(MockDefault)
  const { setOptions, navigate } = useUnifiedNavigation()

  useLayoutEffect(() => {
    setOptions({ title: t('spaces.title') })
  }, [setOptions, t])

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

  const { loading, data, error } = useQuery<SpacesResponse>(spacesQuery, {
    variables: {
      limit: SPACES_PAGE_SIZE,
      offset: 0,
    },
  })

  const spaces = useMemo(() => data?.spaces.data || [], [data])

  useEffect(() => {
    if (spaces.length > 0) {
      setMockData({
        ...MockDefault,
        matchedSpaces: [
          {
            id: '1',
            topic: 'Animal Welfare',
            spaces,
          },
        ],
        unmatchedSpaces: [
          {
            id: '2',
            topic: 'Childcare',
            spaces,
          },
          {
            id: '3',
            topic: 'Environment',
            spaces,
          },
        ],
      })
    }
  }, [spaces])

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
    <DefaultLayout>
      <View style={mixins.container}>
        <HoliText size="large" style={{ marginTop: 48, marginBottom: 48 }}>
          {/*PLACEHOLDER FOR FILTER HEADER*/ 'Discover [ALL] spaces in [Berlin].'}
        </HoliText>

        {mockData.matchedSpaces.length ? (
          <View style={{ marginBottom: 12 }}>
            {mockData.matchedSpaces.map((entry) => (
              <TopicSlider key={`unmatched_${entry.id}`} {...entry} />
            ))}
          </View>
        ) : (
          <HoliText>No Matches</HoliText>
        )}

        {mockData.unmatchedSpaces.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <HoliHeading size="large" style={{ marginBottom: 24 }}>
              {t('spaces.otherListing')}
            </HoliHeading>
            {mockData.unmatchedSpaces.map((entry) => (
              <TopicSlider key={`unmatched_${entry.id}`} {...entry} />
            ))}
          </View>
        )}
      </View>
    </DefaultLayout>
  )
}

export default Spaces
const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
})
