import { useQuery } from '@apollo/client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import SpacesListing from '@holi/core/screens/spaces/components/SpacesListing'
import SpacesSearchForm from '@holi/core/screens/spaces/components/SpacesSearchForm'
import {
  FilteredSpacesResponse,
  SpacesResponse, // filteredSpacesQuery,
  spacesQuery,
} from '@holi/core/screens/spaces/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
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

export type SpacesParams = {
  topics?: string
  location?: string
}

const SPACES_PAGE_SIZE = 10

const { useParam } = createParam<SpacesParams>()

const Spaces: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { t } = useTranslation()
  const title = t('spaces.title')
  const mixins = useStyleMixins()
  const { height: deviceHeight } = useWindowDimensions()
  const [showSearchModal, setShowSearchModal] = useState(false)
  const closeModal = useCallback(() => {
    setShowSearchModal(false)
  }, [])
  const [topicsQuery, setTopicsQuery] = useParam('topics')
  const [locationQuery, setLocationQuery] = useParam('location')
  const submitSearch = useCallback(
    ({ topics, location }) => {
      setTopicsQuery(topics)
      setLocationQuery(location)
      closeModal()
    },
    [setTopicsQuery, setLocationQuery, closeModal]
  )

  const [mockData, setMockData] = useState<FilteredSpacesResponse>(MockDefault)

  useNavigationHeader(navigation, {
    title: title,
    headerRight: () => (
      <HoliButton
        label={t('donations:search.heading')}
        inline
        transparent
        onPress={() => setShowSearchModal(true)}
        testID="donations-search-button"
      >
        <HoliIcon icon="search-2" size={24} />
      </HoliButton>
    ),
  })

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
      <HoliModal
        show={showSearchModal}
        onDismiss={closeModal}
        testID="spaces-search-modal"
        label={t('search.title')}
        autoHeight={false}
        // Smaller devides use the whole screen and
        // larger ones should have more space above for clicking the backdrop pane
        minRelativeHeight={deviceHeight > 750 ? 0.85 : 0}
      >
        <SpacesSearchForm onSubmit={submitSearch} topicsQuery={topicsQuery} locationQuery={locationQuery} />
      </HoliModal>
      <View style={mixins.container}>
        <HoliText size="large" style={{ marginTop: 48, marginBottom: 48 }}>
          {
            /*
             * PLACEHOLDER FOR FILTER HEADER
             * topicsQuery={topicsQuery} locationQuery={locationQuery}
             */
            'Discover [ALL] spaces in [Berlin].'
          }
        </HoliText>
        <SpacesListing data={mockData} />
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
