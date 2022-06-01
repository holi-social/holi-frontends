import React from 'react'
import { View } from 'react-native'
import { createParam } from 'solito'

import HoliHeading from '@holi/ui/components/HoliHeading'

export type TopicEditorsScreenParams = {
  topicId: string
}

const { useParam } = createParam<TopicEditorsScreenParams>()

export const TopicEditorsScreen: React.VFC = () => {
  const [topicId] = useParam('topicId')
  return (
    <View style={{ padding: 10 }}>
      <HoliHeading level={1}>This week&lsquo;s topic editors for topicId={topicId}</HoliHeading>
    </View>
  )
}
