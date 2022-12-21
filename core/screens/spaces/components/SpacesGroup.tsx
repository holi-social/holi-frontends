import React, { memo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import SpacesGroupSlider from '@holi/core/screens/spaces/components/SpacesGroupSlider'
import { Space } from '@holi/core/screens/spaces/types'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'

const SPACES_PAGE_SIZE = 10

type SpacesGroupProps = {
  spaces: Paged<Space>
  topic?: Topic
  location?: string
  skill?: Skill
  style?: StyleProp<ViewStyle>
}

const SpacesGroup: React.VFC<SpacesGroupProps> = ({ spaces, topic, location, skill, style }: SpacesGroupProps) => {
  const { totalResults = 0, data: spacesData = [] } = spaces || {}

  if (!spacesData.length) {
    return <></>
  }
  return (
    <SpacesGroupSlider
      topic={topic}
      skill={skill}
      location={location}
      style={style}
      spaces={spacesData.slice(0, SPACES_PAGE_SIZE)}
      paddingVertical={8}
      slideGap={8}
      hasMore={totalResults > SPACES_PAGE_SIZE}
    />
  )
}

export default memo(SpacesGroup)
