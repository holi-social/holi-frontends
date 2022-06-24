import React from 'react'
import { View } from 'react-native'
import { createParam } from 'solito'

import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export type TopicEditorsScreenParams = {
  topicId: string
}

const { useParam } = createParam<TopicEditorsScreenParams>()

export const TopicEditorsScreen: React.VFC = () => {
  const [topicId] = useParam('topicId')
  return (
    <View style={{ padding: 10 }}>
      <HoliText type={HoliTextType.super}>{`This week&lsquo;s topic editors for topicId=${topicId}`}</HoliText>
    </View>
  )
}
