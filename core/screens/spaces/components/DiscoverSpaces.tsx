import { useQuery } from '@apollo/client'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'
import { SpacesByTopicResponse, spacesQueryMultipleTopics } from '@holi/core/screens/spaces/queries'
import { Topic, User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const SPACES_PAGE_SIZE = 10

type DiscoverSpacesProps = {
  user?: User
  topics: Topic[]
  style?: StyleProp<ViewStyle>
}

const DiscoverSpaces: React.VFC<DiscoverSpacesProps> = ({ topics, user, style }) => {
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

  return <DiscoverSpacesView style={style} user={user} topics={topics} spaces={data?.spacesByTopic ?? []} />
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
})

export default DiscoverSpaces
