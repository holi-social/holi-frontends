import { useQuery } from '@apollo/client'
import SpacesByTopic from 'core/screens/spaces/components/SpacesByTopic'
import partition from 'lodash.partition'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import { topicsQuery } from '@holi/core/screens/spaces/queries'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import { TopicsQueryResult } from '@holi/core/screens/userprofile/queries'
import { termComparator } from '@holi/core/screens/userprofile/types'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Spaces: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { t } = useTranslation()
  const title = t('spaces.title')
  const mixins = useStyleMixins()

  useNavigationHeader(navigation, { title: title })

  const { loading, data, error } = useQuery<TopicsQueryResult>(topicsQuery)

  const topics = useMemo(() => data?.topics.data?.slice().sort(termComparator) || [], [data])

  const { user } = useContext(UserContext)
  const [filteredTopics, otherTopics] = useMemo(() => {
    const userInterestIds = (user?.interests || []).map((topic) => topic.id)
    return partition(topics, (topic) => userInterestIds.includes(topic.id))
  }, [topics, user])

  if (error) {
    displayError(error, t('spaces.spaceListing.error'))
  }

  if (loading) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('spaces.spaceListing.loading')}</HoliText>
      </View>
    )
  }

  return (
    <DefaultLayout>
      <View style={mixins.container}>
        <HoliText size="large" style={{ marginTop: 48, marginBottom: 48 }}>
          {/*PLACEHOLDER FOR FILTER HEADER*/ 'Discover [ALL] spaces in [Berlin].'}
        </HoliText>

        {filteredTopics.map((topic) => (
          <SpacesByTopic key={topic.id} topic={topic} style={{ marginBottom: 12 }} />
        ))}

        {filteredTopics.length > 0 && otherTopics.length > 0 && (
          <HoliHeading size="large" style={{ marginBottom: 24 }}>
            {t('spaces.otherListing')}
          </HoliHeading>
        )}
        {otherTopics.map((topic) => (
          <SpacesByTopic key={topic.id} topic={topic} style={{ marginBottom: 12 }} />
        ))}
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
})

export default Spaces
