import { useQuery } from '@apollo/client'
import partition from 'lodash.partition'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import SpacesByTopic from '@holi/core/screens/spaces/components/SpacesByTopic'
import SpacesFilterHeader from '@holi/core/screens/spaces/components/SpacesFilterHeader'
import { SpacesByTopicResponse, spacesQueryMultipleTopics } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { Topic, User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const SPACES_PAGE_SIZE = 10

type DiscoverSpacesViewProps = {
  user?: User
  topics: Topic[]
  style?: StyleProp<ViewStyle>
}

const DiscoverSpacesView: React.VFC<DiscoverSpacesViewProps> = ({ topics, user, style }) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const sortedTopics = useMemo(() => topics.slice().sort(termsByTitleComparator) || [], [topics])

  const { loading, data, error } = useQuery<SpacesByTopicResponse>(spacesQueryMultipleTopics, {
    variables: {
      topicIds: sortedTopics.map((t) => t.id),
      limit: SPACES_PAGE_SIZE,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
  })

  const [filteredTopics, otherTopics] = useMemo(() => {
    const userInterestIds = (user?.interests || []).map((topic) => topic.id)
    return partition(sortedTopics, (topic) => userInterestIds.includes(topic.id))
  }, [sortedTopics, user])

  const spacesForTopic = (topicId: string): Paged<Space> => {
    const result = data?.spacesByTopic.find((spacesByTopic) => spacesByTopic.topicId === topicId)?.spaces
    return result || { totalResults: 0, data: [] }
  }

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
    <View style={style} testID="spaces-container">
      <SpacesFilterHeader
        style={styles.headerContainer}
        topics={user?.interests || []}
        location={user?.location}
        allTopics={!user?.interests?.length}
        onPress={() => ({})}
      />

      {filteredTopics.map((topic) => (
        <SpacesByTopic key={topic.id} topic={topic} spaces={spacesForTopic(topic.id)} style={{ marginBottom: 12 }} />
      ))}

      {/* Will be added again once we introduce filtering
      {filteredTopics.length > 0 && otherTopics.length > 0 && (
        <HoliHeading size="large" style={{ marginBottom: 24 }}>
          {t('spaces.otherListing')}
        </HoliHeading>
      )} */}
      {otherTopics.map((topic) => (
        <SpacesByTopic key={topic.id} topic={topic} spaces={spacesForTopic(topic.id)} style={{ marginBottom: 12 }} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 40,
    marginBottom: 48,
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
})

export default DiscoverSpacesView
