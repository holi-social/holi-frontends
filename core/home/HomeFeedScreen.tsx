import React from 'react'
import { Text, View } from 'react-native'

import { fakeTopics } from '@holi/core/topics/fakeTopics'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliHeading from '@holi/ui/components/HoliHeading'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'

export const HomeFeedScreen: React.VFC = () => {
  const { navigate } = useRouting()
  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliHeading level={1} testID="home-feed-title">
        Home
      </HoliHeading>
      <Text style={{ fontSize: 18 }}>Apps</Text>
      <View style={{ flexDirection: 'row' }}>
        <HoliButton
          label="Volunteering"
          inline
          transparent
          onPress={() => navigate('/apps/volunteering')}
          testID="app-tile-volunteering"
        >
          <View style={{ flexDirection: 'column', alignItems: 'center', padding: 10 }}>
            <Holicon icon="work" size={20} />
            <Text>Volunteering</Text>
          </View>
        </HoliButton>
        <HoliButton label="Donations" inline transparent onPress={() => navigate('/apps/volunteering')}>
          <View style={{ flexDirection: 'column', alignItems: 'center', padding: 10 }}>
            <Holicon icon="support" size={20} />
            <Text>Donations</Text>
          </View>
        </HoliButton>
      </View>
      <Text style={{ fontSize: 18, paddingTop: 20 }} testID="home-feed-topics">
        This week’s topics are Immigration, Education and Sustainability
      </Text>
      {[...fakeTopics.keys()].map((topicId) => (
        <HoliButton
          key={topicId}
          label={fakeTopics.get(topicId).title}
          inline
          onPress={() => navigate(`/topics/${topicId}`)}
        >
          {fakeTopics.get(topicId).title}
        </HoliButton>
      ))}
    </View>
  )
}
