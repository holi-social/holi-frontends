import React, { useLayoutEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'
import Holicon from '@holi/ui/components/holicon'

type HomeFeedProps = NativeStackScreenProps<HomeStackScreens>

const HomeFeed: React.VFC<HomeFeedProps> = ({ navigation }: HomeFeedProps) => {
  const { navigate } = useRouting()
  const { setNavigationHeader } = useNavigationHeader()
  const title = 'Topic of the day'

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: title,
        titleElement: () => (
          <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
            {title}
          </HoliText>
        ),
      }),
    [navigation]
  )

  return (
    <View style={styles.view}>
      <HoliText type={HoliTextType.super} testID="home-feed-title">
        Home
      </HoliText>

      {/* Holi Apps */}
      <HoliText type={HoliTextType.heading2}>Apps</HoliText>
      <View style={{ flexDirection: 'row' }}>
        <HoliButton
          label="Volunteering"
          inline
          variant="transparent"
          style={styles.appTile}
          onPress={() => navigate('/apps/volunteering')}
          testID="app-tile-volunteering"
        >
          <Holicon icon="work" size={20} />
          <HoliText type={HoliTextType.body}>Volunteering</HoliText>
        </HoliButton>
        <HoliButton
          label="Donations"
          inline
          variant="transparent"
          onPress={() => navigate('/apps/volunteering')}
          style={styles.appTile}
        >
          <Holicon icon="support" size={20} />
          <HoliText type={HoliTextType.body}>Donations</HoliText>
        </HoliButton>
      </View>

      {/* Weekly Topics */}
      <HoliText type={HoliTextType.heading2} testID="home-feed-topics">
        This week’s topics are Immigration, Education and Sustainability
      </HoliText>

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
    maxWidth: '100%',
  },
  appTile: {
    paddingRight: 10,
  },
})

export default HomeFeed
