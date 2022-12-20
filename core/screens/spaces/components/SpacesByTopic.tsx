import React, { memo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import TopicSlider from '@holi/core/screens/spaces/components/TopicSlider'
import { Space } from '@holi/core/screens/spaces/types'
import { Topic } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'

const SPACES_PAGE_SIZE = 10

type SpacesByTopicProps = {
  topic: Topic
  spaces: Paged<Space>
  style?: StyleProp<ViewStyle>
}

const SpacesByTopic: React.VFC<SpacesByTopicProps> = ({ topic, spaces, style }: SpacesByTopicProps) => {
  const { totalResults = 0, data: spacesData = [] } = spaces || {}

  if (!spacesData.length) {
    return <></>
  }
  return (
    <TopicSlider
      topic={topic}
      style={style}
      spaces={spacesData.slice(0, SPACES_PAGE_SIZE)}
      paddingVertical={8}
      slideGap={8}
      hasMore={totalResults > SPACES_PAGE_SIZE}
    />
  )
}

export default memo(SpacesByTopic)
