import { withProfiler } from '@sentry/react'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import { createAuthorizationHeaders } from '@holi/api/helpers'
import { logError } from '@holi/core/errors/helpers'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'

import AttendingChallengeEventsCard from '@holi-apps/challenges/components/AttendingChallengeEventsCard'
import { ChallengeEvent } from '@holi-apps/challenges/components/types'
import { challengeAppBaseUrl } from '@holi-apps/challenges/config'

// import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'

const API_URL = challengeAppBaseUrl + '/api/v1/events/userAttendingEvents'

const CARD_WIDTH = 260

const AttendingChallengeEvents = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<ChallengeEvent[]>([])
  //   const { t } = useTranslation()
  //   const { navigate } = useRouting()
  //   const { width: screenWidth } = useWindowDimensions()
  //   const cardWidth = calculateCardWidth(screenWidth)

  useEffect(() => {
    createAuthorizationHeaders().then((headers) => {
      // console.log('headers', headers)
      // const xx = {
      //   ...headers,
      //   // 'X-Client-Platform': 'holi',
      //   // 'X-Client-Platform-Version': Constants.expoConfig?.version,
      //   // 'X-Client-Platform-Feature-Flags': 'no-back-app-header, umuted-video-start',
      //   // 'X-Client-Platform-User-Consent': 'true',
      // }
      // console.log('headers xx', xx)
      fetch(API_URL, {
        headers: new Headers(headers),
      })
        .then((res) => {
          if (res.status != 200) return []
          res.json().then((events: ChallengeEvent[]) => {
            setEvents(events)
          })
        })
        .catch((error) => {
          logError(error, 'Error fetching challenge events', {
            location: 'AttendingChallengeEvents.useEffect',
          })
        })
        .finally(() => setIsLoading(false))
    })
  }, [])

  if (isLoading || !events.length) {
    return null
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        style={styles.listContainer}
        data={events}
        renderItem={({ item, index }) => {
          return (
            <>
              <AttendingChallengeEventsCard challengeEvent={item} />
              {index === (events?.length || 0) - 1 && <HoliGap direction="horizontal" size="l" />}
            </>
          )
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

export default withProfiler(AttendingChallengeEvents, { name: 'AttendingChallenges' })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 10,
  },
  listContainer: {
    flex: 1,
    paddingLeft: 24,
    paddingBottom: 12,
    marginHorizontal: -20,
  },
  cardContainer: {
    marginRight: 12,
    width: CARD_WIDTH,
  },
  lastCard: {
    marginRight: 44,
  },
})
