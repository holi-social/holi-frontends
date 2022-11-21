import partition from 'lodash.partition'
import React, { memo, useMemo } from 'react'
// import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpacesByTopic from '@holi/core/screens/spaces/components/SpacesByTopic'
import SpacesFilterHeader from '@holi/core/screens/spaces/components/SpacesFilterHeader'
import { Topic, User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'

// import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

type SpacesViewProps = {
  user?: User
  topics: Topic[]
  style?: StyleProp<ViewStyle>
}

const SpacesView: React.VFC<SpacesViewProps> = ({ topics, user, style }) => {
  // const { t } = useTranslation()

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

      {/* {filteredTopics.length > 0 && otherTopics.length > 0 && (
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

export default memo(SpacesView)
