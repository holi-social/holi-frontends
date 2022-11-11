import { useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  FilteredSpacesResponse,
  SpacesResponse, // filteredSpacesQuery,
  spacesQuery,
} from '@holi/core/screens/spaces/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
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

  const spaces = useMemo(() => data?.spaces || [], [data])

  useEffect(() => {
    if (spaces.length > 0) {
      setMockData({
        ...MockDefault,
        matchedSpaces: [
          {
            id: 1,
            topic: 'Animal Welfare',
            spaces,
          },
        ],
        unmatchedSpaces: [
          {
            id: 2,
            topic: 'Childcare',
            spaces,
          },
          {
            id: 3,
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
          <View>
            <HoliText>MATCHED SPACES</HoliText>
            {mockData.matchedSpaces.map((entry) => (
              <View key={`unmatched_${entry.topic}`}>
                <HoliText>{entry.topic}</HoliText>
                {entry.spaces.map((space) => (
                  <HoliButton key={space.id} label={space.title} onPress={() => navigate(`/spaces/${space.id}`)}>
                    <HoliText>{space.title}</HoliText>
                  </HoliButton>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <HoliText>No Matches</HoliText>
        )}

        {mockData.unmatchedSpaces.length > 0 && (
          <View>
            <HoliText>OTHER SPACES</HoliText>
            {mockData.unmatchedSpaces.map((entry) => (
              <View key={`unmatched_${entry.topic}`}>
                <HoliText>{entry.topic}</HoliText>
                {entry.spaces.map((space) => (
                  <HoliButton key={space.id} label={space.title} onPress={() => navigate(`/spaces/${space.id}`)}>
                    <HoliText>{space.title}</HoliText>
                  </HoliButton>
                ))}
              </View>
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
