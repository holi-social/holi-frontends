import React from 'react'
import { Text, View } from 'react-native'
import { createParam } from 'solito'

export type TopicEditorsScreenParams = {
  topicId: string
}

const { useParam } = createParam<TopicEditorsScreenParams>()

export const TopicEditorsScreen: React.VFC = () => {
  const [topicId] = useParam('topicId')
  return (
    <View style={{ padding: 10 }}>
      <Text>This week&lsquo;s topic editors for topicId={topicId}</Text>
    </View>
  )
}
