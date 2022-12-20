import partition from 'lodash.partition'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import SpacesByTopic from '@holi/core/screens/spaces/components/SpacesByTopic'
import { SpacesForTopic } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

type DiscoverSpacesViewProps = {
  user?: User
  style?: StyleProp<ViewStyle>
  spaces: SpacesForTopic[]
}

const DiscoverSpacesView: React.VFC<DiscoverSpacesViewProps> = ({ user, style, spaces }) => {
  const { topics } = useContext(SpaceTermContext)

  const { t } = useTranslation()

  const sortedTopics = useMemo(() => topics.slice().sort(termsByTitleComparator) || [], [topics])

  const [filteredTopics, otherTopics] = useMemo(() => {
    const userInterestIds = (user?.interests || []).map((topic) => topic.id)
    return partition(sortedTopics, (topic) => userInterestIds.includes(topic.id))
  }, [sortedTopics, user])

  const spacesForTopic = (topicId: string): Paged<Space> => {
    const result = spaces.find((spacesByTopic) => spacesByTopic.topicId === topicId)?.spaces
    return result || { totalResults: 0, data: [] }
  }

  return (
    <View style={style} testID="spaces-container">
      <HoliHeading level="1" size="large" style={styles.headerTitle} testID="discover-spaces-header">
        {t('spaces.discover.welcome')}
      </HoliHeading>
      <HoliText style={styles.headerDescription} testID="discover-spaces-description">
        {t('spaces.discover.description')}
      </HoliText>

      <View style={styles.body}>
        {filteredTopics.map((topic) => (
          <SpacesByTopic key={topic.id} topic={topic} spaces={spacesForTopic(topic.id)} style={styles.spacesByTopic} />
        ))}

        {/* Will be added again once we introduce filtering
        {filteredTopics.length > 0 && otherTopics.length > 0 && (
          <HoliHeading size="large" style={{ marginBottom: 24 }}>
            {t('spaces.otherListing')}
          </HoliHeading>
        )} */}
        {otherTopics.map((topic) => (
          <SpacesByTopic key={topic.id} topic={topic} spaces={spacesForTopic(topic.id)} style={styles.spacesByTopic} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    marginTop: 24,
    fontWeight: '400',
  },
  headerDescription: {
    marginTop: 8,
    fontWeight: '400',
  },
  body: {
    marginTop: 37,
  },
  spacesByTopic: {
    marginBottom: 12,
  },
})

export default DiscoverSpacesView
