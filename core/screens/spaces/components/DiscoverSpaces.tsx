import { useLazyQuery } from '@apollo/client'
import React, { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'
import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import { DEFAULT_LOCATION, getDefaultTopicIds } from '@holi/core/screens/spaces/helpers/defaultFilters'
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

  // user specific spaces suggestions
  const [fetchUserSpecifc, { loading: loadingUserSpecific, data: dataUserSpecific, error: errorUserSpecific }] =
    useLazyQuery<DiscoverSpacesResponse>(discoverSpacesQuery, {
      variables: {
        topicIds: userTopics.map((t) => t.id),
        skillIds: userSkills.map((s) => s.id),
        location: user?.location,
        limit: SPACES_GROUP_LIMIT,
      },
      fetchPolicy: 'cache-and-network',
    })

  // default spaces suggestions
  const [fetchDefault, { loading: loadingDefaultData, data: dataDefault, error: errorDefault }] =
    useLazyQuery<DiscoverSpacesResponse>(discoverSpacesQuery, {
      variables: {
        topicIds: defaultTopicIds,
        location:
          (user?.location || '').toLocaleLowerCase() === DEFAULT_LOCATION.toLocaleLowerCase() ? null : DEFAULT_LOCATION,
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

  if (errorUserSpecific) {
    displayError(errorUserSpecific, t('spaces.spaceListing.error'))
  }

  if (errorDefault) {
    displayError(errorDefault, t('spaces.spaceListing.error'))
  }

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
