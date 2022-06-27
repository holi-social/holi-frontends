import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

type TopicEditorsProps = {
  topicId: string
}

export const TopicEditors: React.FunctionComponent<TopicEditorsProps> = ({ topicId }) => {
  return (
    <View style={{ padding: 10 }}>
      <HoliText type={HoliTextType.super}>{`This week's topic editors for topicId=${topicId}`}</HoliText>
    </View>
  )
}
