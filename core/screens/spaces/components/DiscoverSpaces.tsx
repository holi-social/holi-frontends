import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

// import { defaultTopicFilters } from '@holi/core/screens/spaces/helpers/defaultFilters'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

// import SpacesByTopic from './SpacesByTopic'

type DiscoverSpacesProps = {
  user?: User
  style?: StyleProp<ViewStyle>
}

const DiscoverSpaces: React.VFC<DiscoverSpacesProps> = ({ style }) => {
  const { t } = useTranslation()

  // const [filteredTopics] = useMemo(() => {
  //   const userInterestIds = (user?.interests || []).map((topic) => topic.id)
  //   return partition(defaultTopicFilters, (topic) => userInterestIds.includes(topic.id))
  // }, [defaultTopicFilters, user])

  // const spacesForTopic = (topicId: string): Paged<Space> => {
  //   const result = spaces.find((spacesByTopic) => spacesByTopic.topicId === topicId)?.spaces
  //   return result || { totalResults: 0, data: [] }
  // }

  // const { loading, data, error } = useQuery<SpacesByTopicResponse>(spacesQueryMultipleTopics, {
  //   variables: {
  //     topicIds: topics.map((t) => t.id),
  //     limit: SPACES_PAGE_SIZE,
  //     offset: 0,
  //   },
  //   fetchPolicy: 'cache-and-network',
  // })

  // console.log(data, error, loading)

  // if (error) {
  //   displayError(error, t('spaces.spaceListing.error'))
  // }

  // return <DiscoverSpacesView style={style} user={user} spaces={data?.spacesByTopic ?? []} />

  return (
    <View style={style} testID="spaces-container">
      <HoliHeading level="1" size="large" style={styles.headerTitle} testID="discover-spaces-header">
        {t('spaces.discover.welcome')}
      </HoliHeading>
      <HoliText style={styles.headerDescription} testID="discover-spaces-description">
        {t('spaces.discover.description')}
      </HoliText>

      <View style={styles.body}>
        {/* {filteredTopics.map((topic) => (
      <SpacesByTopic key={topic.id} topic={topic} spaces={spacesForTopic(topic.id)} style={styles.spacesByTopic} />
    ))} */}

        {/* Will be added again once we introduce filtering
    {filteredTopics.length > 0 && otherTopics.length > 0 && (
      <HoliHeading size="large" style={{ marginBottom: 24 }}>
        {t('spaces.otherListing')}
      </HoliHeading>
    )} */}
        {/* {otherTopics.map((topic) => (
      <SpacesByTopic key={topic.id} topic={topic} spaces={spacesForTopic(topic.id)} style={styles.spacesByTopic} />
    ))} */}
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
    marginBottom: 31,
  },
})

export default DiscoverSpaces
