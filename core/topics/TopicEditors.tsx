import React from 'react'
import { View } from 'react-native'

import HoliHeading from '@holi/ui/components/HoliHeading'

type TopicEditorsProps = {
  topicId: string
}

export const TopicEditors: React.FunctionComponent<TopicEditorsProps> = ({ topicId }) => {
  return (
    <View style={{ padding: 10 }}>
      <HoliHeading level={1}>This week&lsquo;s topic editors for topicId={topicId}</HoliHeading>
    </View>
  )
}
