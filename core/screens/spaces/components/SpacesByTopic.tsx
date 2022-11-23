import { useQuery } from '@apollo/client'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import TopicSlider from '@holi/core/screens/spaces/components/TopicSlider'
import { SpacesResponse, spacesQuery } from '@holi/core/screens/spaces/queries'
import { Topic } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const SPACES_PAGE_SIZE = 10

type SpacesByTopicProps = {
  topic: Topic
  style?: StyleProp<ViewStyle>
}

const SpacesByTopic: React.VFC<SpacesByTopicProps> = ({ topic, style }: SpacesByTopicProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { loading, data, error } = useQuery<SpacesResponse>(spacesQuery, {
    variables: {
      topicId: topic.id,
      limit: SPACES_PAGE_SIZE,
      offset: 0,
    },
  })

  const spaces = data?.spaces.data || []

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

  if (!spaces.length) {
    return <></>
  }

  return <TopicSlider topic={topic.title} style={style} spaces={spaces} />
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
})

export default memo(SpacesByTopic)
