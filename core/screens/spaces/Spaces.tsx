import { useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesFilterHeader from '@holi/core/screens/spaces/components/SpacesFilterHeader'
import TopicSlider from '@holi/core/screens/spaces/components/TopicSlider'
import {
  FilteredSpacesResponse,
  SpacesResponse, // filteredSpacesQuery,
  spacesQuery,
} from '@holi/core/screens/spaces/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
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

const Spaces: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { t } = useTranslation()
  const title = t('spaces.title')
  const mixins = useStyleMixins()
  const { navigate } = useRouting()

  const [mockData, setMockData] = useState<FilteredSpacesResponse>(MockDefault)

  useNavigationHeader(navigation, { title: title })

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
          {
            id: '2',
            topic: 'Animal',
            spaces,
          },
          {
            id: '2',
            topic: 'Welfare',
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
        <SpacesFilterHeader
          style={styles.spacesContainer}
          topics={[
            { id: '1', title: 'Animal Welfare' },
            { id: '2', title: 'Animal' },
            { id: '3', title: 'Welfare' },
          ]}
          location={MockDefault.filter.location}
          allTopics={false}
          onPress={() => navigate('/apps/donations')}
        />
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
  spacesContainer: {
    paddingVertical: 24,
  },
})
