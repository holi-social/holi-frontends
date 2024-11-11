import { withProfiler } from '@sentry/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { useLoginState } from '@holi/core/auth/loginState'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { dimensions } from '@holi/ui/styles/globalVars'

import AttendingChallengeEventsCard from '@holi-apps/challenges/components/AttendingChallengeEventsCard'
import { ChallengeEvent } from '@holi-apps/challenges/components/types'
import { challengeAppBaseUrl } from '@holi-apps/challenges/config'
import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'

const API_URL = challengeAppBaseUrl + '/api/v1/events/userAttendingEvents'

const CARD_WIDTH = 260

export const calculateCardWidth = (screenWidth: number) => (Platform.OS === 'web' ? CARD_WIDTH : screenWidth - 32)

const AttendingChallengeEvents = () => {
  const [events, setEvents] = useState<ChallengeEvent[]>([])
  const { width: screenWidth } = useWindowDimensions()
  const cardWidth = calculateCardWidth(screenWidth)
  const styles = getStyles(cardWidth)
  const headers = useChallengesHeaders()
  const { isLoggedIn } = useLoginState()

  const fetchAttendingEvents = useCallback(() => {
    // Events are only available to logged in users
    if (!isLoggedIn || !headers) {
      return
    }
    return fetch(API_URL, {
      headers: new Headers(headers),
    })
      .then((res) => {
        if (!res.ok) {
          logError(
            new Error('Failed to fetch attending challenge events'),
            'Error fetching attending challenge events',
            {
              location: 'AttendingChallengeEvents.useEffect',
            }
          )
          return
        }
        return res.json()
      })
      .then((events: ChallengeEvent[]) => {
        setEvents(events)
      })
      .catch((error) => {
        logError(error, 'Error fetching challenge events', {
          location: 'AttendingChallengeEvents.useEffect',
        })
      })
  }, [headers, isLoggedIn])

  useEffect(() => {
    fetchAttendingEvents()
  }, [fetchAttendingEvents])
  useOnRefresh(fetchAttendingEvents)

  if (!isLoggedIn || !events?.length) {
    return null
  }

  return (
    <HoliContainer>
      <View style={styles.container}>
        <FlatList
          horizontal
          style={styles.listContainer}
          data={events}
          renderItem={({ item, index }) => (
            <View style={StyleSheet.flatten([styles.itemContainer, index === events.length - 1 && styles.lastItem])}>
              <AttendingChallengeEventsCard challengeEvent={item} />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </HoliContainer>
  )
}

export default withProfiler(AttendingChallengeEvents, { name: 'AttendingChallengeEvents' })

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
      paddingLeft: 20,
      marginHorizontal: -20,
      gap: dimensions.spacingXs,
    },
    itemContainer: {
      width: cardWidth,
      marginRight: dimensions.spacingXxs,
    },
    lastItem: {
      marginRight: 44,
    },
  })
