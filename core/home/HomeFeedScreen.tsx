import React from 'react'
import { Button, Pressable, Text, View } from 'react-native'

import { fakeTopics } from '@holi/core/topics/fakeTopics'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'

export const HomeFeedScreen: React.VFC = () => {
  const { navigate } = useRouting()
  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }} testID='home-feed-title'>Home</Text>
      <Text style={{ fontSize: 18 }}>Apps</Text>
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={() => navigate('/apps/volunteering')}>
          <View testID='app-tile-volunteering' style={{ flexDirection: 'column', alignItems: 'center', padding: 10 }}>
            <Holicon icon="work" size={20} />
            <Text>Volunteering</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => navigate('/apps/volunteering')}>
          <View style={{ flexDirection: 'column', alignItems: 'center', padding: 10 }}>
            <Holicon icon="support" size={20} />
            <Text>Donations</Text>
          </View>
        </Pressable>
      </View>
      <Text style={{ fontSize: 18, paddingTop: 20 }} testID='home-feed-topics'>
        This week’s topics are Immigration, Education and Sustainability
      </Text>
      {[...fakeTopics.keys()].map((topicId) => (
        <Button key={topicId} onPress={() => navigate(`/topics/${topicId}`)} title={fakeTopics.get(topicId).title} />
      ))}
    </View>
  )
}
