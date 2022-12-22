import { useLazyQuery } from '@apollo/client'
import React, { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'
import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import {
  DEFAULT_LOCATION,
  DEFAULT_TOPIC_IDS,
  getDefaultTopicIds,
} from '@holi/core/screens/spaces/helpers/defaultFilters'
import { DiscoverSpacesResponse, discoverSpacesQuery } from '@holi/core/screens/spaces/queries'
import { User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const SPACES_PAGE_SIZE = 10

type DiscoverSpacesProps = {
  user?: User
  style?: StyleProp<ViewStyle>
}

const DiscoverSpaces: React.VFC<DiscoverSpacesProps> = ({ user, style }) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { loading: topicsLoading, topics = [] } = useContext(SpaceTermContext)

  const existingTopics = useMemo(() => topics.slice().sort(termsByTitleComparator) || [], [topics])
  const userTopics = useMemo(() => (user?.interests || []).slice().sort(termsByTitleComparator) || [], [user])
  const userSkills = useMemo(() => (user?.skills || []).slice().sort(termsByTitleComparator) || [], [user])

  const defaultTopicIds = useMemo(
    () =>
      getDefaultTopicIds(
        DEFAULT_TOPIC_IDS,
        existingTopics.map((t) => t.id),
        userTopics.map((t) => t.id)
      ),
    [existingTopics, userTopics]
  )

  // user specific spaces suggestions
  const [fetchUserSpecifc, { loading: loadingUserSpecific, data: dataUserSpecific, error: errorUserSpecific }] =
    useLazyQuery<DiscoverSpacesResponse>(discoverSpacesQuery, {
      variables: {
        topicIds: userTopics.map((t) => t.id),
        skillIds: userSkills.map((s) => s.id),
        location: user?.location,
        limit: SPACES_PAGE_SIZE,
        offset: 0,
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
        limit: SPACES_PAGE_SIZE,
        offset: 0,
      },
      fetchPolicy: 'cache-and-network',
    })

  useEffect(() => {
    if (topics && topics.length) {
      fetchUserSpecifc()
      fetchDefault()
    }
  }, [fetchUserSpecifc, fetchDefault, topics])

  if (errorUserSpecific) {
    displayError(errorUserSpecific, t('spaces.spaceListing.error'))
  }

  if (errorDefault) {
    displayError(errorDefault, t('spaces.spaceListing.error'))
  }

  if (topicsLoading || loadingUserSpecific || loadingDefaultData) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.loadingContainer]}>
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
    alignItems: 'center',
    marginTop: 50,
  },
})

export default DiscoverSpaces
