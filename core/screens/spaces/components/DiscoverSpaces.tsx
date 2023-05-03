import { useLazyQuery } from '@apollo/client'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { GeoPlaceDetailsResponse, geoPlaceDetailsQuery } from '@holi/core/location/queries'
import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'
import { DEFAULT_LOCATION_ID, getDefaultTopicIds } from '@holi/core/screens/spaces/helpers/defaultFilters'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { DiscoverSpacesResponse, discoverSpacesQuery } from '@holi/core/screens/spaces/queries'
import { User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import { GeolocationMultiPolygon } from '@holi/core/types'
import HoliText from '@holi/ui/components/atoms/HoliText'

/**
 * DiscoverSpaces are not paginated but may contain a limit of items in each list of spaces.
 * This means that the offset variable is ommited in our query, but we may add a limit variable.
 */
const SPACES_GROUP_LIMIT = 10

type DiscoverSpacesProps = {
  user?: User
  style?: StyleProp<ViewStyle>
}

const DiscoverSpaces: React.VFC<DiscoverSpacesProps> = ({ user, style }) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  const { loadingTopics, topics = [] } = useContext(SpaceTermContext)

  const userTopics = useMemo(() => (user?.interests || []).slice().sort(termsByTitleComparator) || [], [user])
  const userSkills = useMemo(() => (user?.skills || []).slice().sort(termsByTitleComparator) || [], [user])

  const defaultTopicIds = useMemo(
    () =>
      getDefaultTopicIds(
        topics,
        userTopics.map((t) => t.id)
      ),
    [topics, userTopics]
  )

  const [fetchPlaceDetails] = useLazyQuery<GeoPlaceDetailsResponse>(geoPlaceDetailsQuery)
  // TODO(SF) combine in object
  const [geolocation, setGeolocation] = useState<GeolocationMultiPolygon>()
  const [locationName, setLocationName] = useState<string>()

  useEffect(() => {
    fetchPlaceDetails({ variables: { id: DEFAULT_LOCATION_ID } })
      .then((response) => {
        setGeolocation(response.data?.geo_placeDetails.boundaries?.coordinates)
        setLocationName(response?.data?.geo_placeDetails.name)
      })
      .catch((error) => {
        // TODO(SF) improve? display proper error message to the user?
        logError(error, `[FilteredSpaces.tsx]: Failed to fetch place details: ${error.message}`)
      })
  }, [fetchPlaceDetails])

  // user specific spaces suggestions
  const [fetchUserSpecifc, { loading: loadingUserSpecific, data: dataUserSpecific, error: errorUserSpecific }] =
    useLazyQuery<DiscoverSpacesResponse>(discoverSpacesQuery, {
      variables: {
        topicIds: userTopics.map((t) => t.id),
        skillIds: userSkills.map((s) => s.id),
        limit: SPACES_GROUP_LIMIT,
      },
      fetchPolicy: 'cache-and-network',
    })

  // TODO(SF) delay until geolocation has been fetched?
  // default spaces suggestions
  const [fetchDefault, { loading: loadingDefaultData, data: dataDefault, error: errorDefault }] =
    useLazyQuery<DiscoverSpacesResponse>(discoverSpacesQuery, {
      variables: {
        topicIds: defaultTopicIds,
        location: locationName, // TODO(SF) null if equal to user?.location_id
        geolocation: geolocation,
        limit: SPACES_GROUP_LIMIT,
      },
      fetchPolicy: 'cache-and-network',
    })

  useEffect(() => {
    if (!topics.length) return

    if (user) {
      fetchUserSpecifc()
    }

    fetchDefault()
  }, [fetchUserSpecifc, fetchDefault, topics, user])

  useEffect(() => {
    if (errorUserSpecific || errorDefault) {
      displayError(errorUserSpecific, t('spaces.spaceListing.error'))
    }
  }, [displayError, errorDefault, errorUserSpecific, t])

  if (loadingTopics || (!dataUserSpecific && loadingUserSpecific) || (!dataDefault && loadingDefaultData)) {
    // TODO: replace with proper loading indicator
    return (
      <View style={styles.loadingContainer}>
        <HoliText>{t('spaces.spaceListing.loading')}</HoliText>
      </View>
    )
  }

  return (
    <DiscoverSpacesView
      style={style}
      user={user}
      userSpecificSpacesGroups={dataUserSpecific?.discoverSpaces ?? []}
      defaultSpacesGroups={dataDefault?.discoverSpaces ?? []}
    />
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    marginTop: 24,
  },
})

export default DiscoverSpaces
