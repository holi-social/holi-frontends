import { useLazyQuery } from '@apollo/client'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { GeoPlaceDetailsResponse, geoPlaceDetailsQuery } from '@holi/core/location/queries'
import { PlaceDetails } from '@holi/core/location/typings'
import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'
import { DEFAULT_LOCATION_ID, getDefaultTopicIds } from '@holi/core/screens/spaces/helpers/defaultFilters'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { DiscoverSpacesResponse, discoverSpacesQuery } from '@holi/core/screens/spaces/queries'
import { User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'
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
  const [defaultLocation, setDefaultLocation] = useState<PlaceDetails | undefined>()

  useEffect(() => {
    fetchPlaceDetails({ variables: { id: DEFAULT_LOCATION_ID } })
      .then((response) => {
        setDefaultLocation(response.data?.geo_placeDetails)
      })
      .catch((error) => {
        // TODO(SF) improve? display proper error message to the user?
        logError(error, `[FilteredSpaces.tsx]: Failed to fetch place details for default geolocation: ${error.message}`)
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

  // TODO(SF) actually pass location id for filter heading links
  // TODO(SF) only pass full geo feature for user, "pure" geometry otherwise?
  // TODO(SF) delay until geolocation has been fetched?
  // default spaces suggestions
  const [fetchDefault, { loading: loadingDefaultData, data: dataDefault, error: errorDefault }] =
    useLazyQuery<DiscoverSpacesResponse>(discoverSpacesQuery, {
      variables: {
        topicIds: defaultTopicIds,
        geolocation: user?.geolocationId !== DEFAULT_LOCATION_ID ? defaultLocation?.geometry : undefined,
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
