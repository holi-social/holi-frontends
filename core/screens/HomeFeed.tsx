import moment from 'moment'
import React, { useLayoutEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'
import Holicon from '@holi/ui/components/holicon'

type HomeFeedProps = NativeStackScreenProps<HomeStackScreens>

const HomeFeed: React.VFC<HomeFeedProps> = ({ navigation }: HomeFeedProps) => {
  const { navigate } = useRouting()
  const { setNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('homeFeed.title')

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: title,
        titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
      }),
    [navigation]
  )

  return (
    <DefaultLayout>
      <View style={styles.view}>
        <HoliHeading level="1" size="super" testID="home-feed-title">
          Home
        </HoliHeading>

        {/* HoliTextInput Test */}
        {/* <HoliTextInput
          label={'Some label'}
          helperText={'Some helper text'}
          returnKeyType={'done'}
          onChange={(text) => {
            console.log({ text })
          }}
        /> */}

        {/* Holi Apps */}
        <HoliHeading level="2">Apps</HoliHeading>
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
            <HoliText>Volunteering</HoliText>
          </HoliButton>
          <HoliButton
            label="Donations"
            inline
            variant="transparent"
            onPress={() => navigate('/apps/volunteering')}
            style={styles.appTile}
          >
            <Holicon icon="support" size={20} />
            <HoliText>Donations</HoliText>
          </HoliButton>
        </View>

        {/* I18n Showcase */}
        <View style={{ flexDirection: 'column' }}>
          <HoliText>
            <Trans t={t} i18nKey="textWithLink">
              <HoliText styles={{ fontWeight: 'bold' }}>this is ignored</HoliText>
            </Trans>
          </HoliText>
          <HoliText>{t('currentDate', { date: t('date', { date: moment() }) })}</HoliText>
        </View>

        {/* Weekly Topics */}
        <HoliHeading level="2" testID="home-feed-topics">
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
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    maxWidth: '100%',
    marginTop: 50,
  },
  appTile: {
    paddingRight: 10,
  },
})

export default HomeFeed
