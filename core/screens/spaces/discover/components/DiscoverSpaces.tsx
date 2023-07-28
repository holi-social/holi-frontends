import { useQuery } from '@apollo/client'
import React, { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useGeolocationDetails } from '@holi/core/location/hooks/useGeolocationDetails'
import DiscoverSpacesView from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'
import { DiscoverSpacesResponse, discoverSpacesQuery } from '@holi/core/screens/spaces/discover/queries'
import { DEFAULT_LOCATION_ID, getDefaultTopicIds } from '@holi/core/screens/spaces/helpers/defaultFilters'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'

/**
 * DiscoverSpaces are not paginated but may contain a limit of items in each list of spaces.
 * This means that the offset variable is ommited in our query, but we may add a limit variable.
 */
const SPACES_GROUP_LIMIT = 5

type DiscoverSpacesProps = {
  user?: User
  style?: StyleProp<ViewStyle>
}

const DiscoverSpaces = ({ user, style }: DiscoverSpacesProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  const { loadingTopics, topics = [], loadingSkills } = useContext(SpaceTermContext)

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

  const {
    geolocationDetails: defaultGeolocation,
    loadingGeolocation: loadingDefaultGeolocation,
    geolocationError: defaultGeolocationError,
  } = useGeolocationDetails(DEFAULT_LOCATION_ID)

  // user specific spaces suggestions
  const {
    loading: loadingUserSpecific,
    data: dataUserSpecific,
    error: errorUserSpecific,
  } = useQuery<DiscoverSpacesResponse>(discoverSpacesQuery, {
    variables: {
      topicIds: userTopics.map((t) => t.id),
      skillIds: userSkills.map((s) => s.id),
      limit: SPACES_GROUP_LIMIT,
      offset: 0,
    },
    skip: !topics.length || !defaultGeolocation || !user,
    fetchPolicy: 'cache-and-network',
  })

  // default spaces suggestions
  const {
    loading: loadingDefaultData,
    data: dataDefault,
    error: errorDefault,
  } = useQuery<DiscoverSpacesResponse>(discoverSpacesQuery, {
    variables: {
      topicIds: defaultTopicIds,
      geolocation: user?.geolocationId !== DEFAULT_LOCATION_ID ? defaultGeolocation?.geolocation : undefined,
      limit: SPACES_GROUP_LIMIT,
      offset: 0,
    },
    skip: !topics.length || !defaultGeolocation,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    const anyError = errorUserSpecific || errorDefault || defaultGeolocationError
    if (anyError) {
      displayError(anyError, t('spaces.spaceListing.error'))
    }
  }, [displayError, errorDefault, errorUserSpecific, defaultGeolocationError, t])

  const loading =
    loadingSkills ||
    loadingTopics ||
    !defaultGeolocation ||
    loadingDefaultGeolocation ||
    (!dataUserSpecific && loadingUserSpecific) ||
    (!dataDefault && loadingDefaultData) ||
    (!dataDefault && !dataUserSpecific)

  return (
    <DiscoverSpacesView
      loading={loading}
      style={style}
      user={user}
      userSpecificSpacesGroups={dataUserSpecific?.discoverSpaces ?? []}
      defaultSpacesGroups={dataDefault?.discoverSpaces ?? []}
    />
  )
}

export default DiscoverSpaces
