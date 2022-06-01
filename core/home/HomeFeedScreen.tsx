import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { fakeTopics } from '@holi/core/topics/fakeTopics'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliHeading from '@holi/ui/components/HoliHeading'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'

export const HomeFeedScreen: React.VFC = () => {
  const { navigate } = useRouting()
  return (
    <View style={styles.view}>
      <HoliHeading level={1} testID="home-feed-title">
        Home
      </HoliHeading>

      {/* Holi Apps */}
      <HoliHeading level={2}>Apps</HoliHeading>

      <View style={{ flexDirection: 'row' }}>
        <HoliButton
          label="Volunteering"
          inline
          transparent
          style={styles.appTile}
          onPress={() => navigate('/apps/volunteering')}
          testID="app-tile-volunteering"
        >
          <Holicon icon="work" size={20} />
          <Text>Volunteering</Text>
        </HoliButton>
        <HoliButton
          label="Donations"
          inline
          transparent
          onPress={() => navigate('/apps/volunteering')}
          style={styles.appTile}
        >
          <Holicon icon="support" size={20} />
          <Text>Donations</Text>
        </HoliButton>
      </View>

      {/* Weekly Topics */}
      <HoliHeading level={2} testID="home-feed-topics">
        This week’s topics are Immigration, Education and Sustainability
      </HoliHeading>

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

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
  },
  appTile: {
    paddingRight: 10,
  },
})
