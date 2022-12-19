import partition from 'lodash.partition'
import React, { useContext, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import SpacesByTopic from '@holi/core/screens/spaces/components/SpacesByTopic'
import SpacesFilterHeader from '@holi/core/screens/spaces/components/SpacesFilterHeader'
import { User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'

type DiscoverSpacesViewProps = {
  user?: User
  style?: StyleProp<ViewStyle>
}

const DiscoverSpacesView: React.VFC<DiscoverSpacesViewProps> = ({ user, style }) => {
  // const { t } = useTranslation()
  const { topics } = useContext(SpaceTermContext)

  const sortedTopics = useMemo(() => topics.slice().sort(termsByTitleComparator) || [], [topics])

  const [filteredTopics, otherTopics] = useMemo(() => {
    const userInterestIds = (user?.interests || []).map((topic) => topic.id)
    return partition(sortedTopics, (topic) => userInterestIds.includes(topic.id))
  }, [sortedTopics, user])

  return (
    <View style={style} testID="spaces-container">
      <SpacesFilterHeader
        style={styles.headerContainer}
        topics={user?.interests || []}
        location={user?.location}
        allTopics={!user?.interests?.length}
        onPress={() => ({})}
      />

      {filteredTopics.map((topic) => (
        <SpacesByTopic key={topic.id} topic={topic} style={{ marginBottom: 12 }} />
      ))}

      {/* Will be added again once we introduce filtering
      {filteredTopics.length > 0 && otherTopics.length > 0 && (
        <HoliHeading size="large" style={{ marginBottom: 24 }}>
          {t('spaces.otherListing')}
        </HoliHeading>
      )} */}
      {otherTopics.map((topic) => (
        <SpacesByTopic key={topic.id} topic={topic} style={{ marginBottom: 12 }} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 40,
    marginBottom: 48,
  },
})

export default DiscoverSpacesView
