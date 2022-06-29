import React from 'react'
import { View } from 'react-native'

import HoliText, { HoliTextType } from '@holi/ui/components/HoliText'

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
