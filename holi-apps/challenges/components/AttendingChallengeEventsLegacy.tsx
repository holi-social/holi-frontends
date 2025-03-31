import { withProfiler } from '@sentry/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { useLoginState } from '@holi/core/auth/loginState'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { dimensions } from '@holi/ui/styles/globalVars'

import type { ChallengeEvent } from '@holi-apps/challenges/components/types'
import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'
import AttendingChallengeEventsCardLegacy from '@holi-apps/challenges/components/AttendingChallengeEventsCardLegacy'
import { apiUrl } from '@holi-apps/challenges/helpers/navigation'

const API_URL = apiUrl('/api/v1/events/userAttendingEvents')

const CARD_WIDTH = 260

export const calculateCardWidth = (screenWidth: number) => (Platform.OS === 'web' ? CARD_WIDTH : screenWidth - 32)

const AttendingChallengeEvents = () => {
  const [events, setEvents] = useState<ChallengeEvent[]>([])
  const [fetched, setIsFetched] = useState(false)
  const { width: screenWidth } = useWindowDimensions()
  const cardWidth = calculateCardWidth(screenWidth)
  const styles = getStyles(cardWidth)
  const headers = useChallengesHeaders()
  const { isLoggedIn } = useLoginState()

  const fetchAttendingEvents = useCallback(async () => {
    // Events are only available to logged in users
    if (fetched || !isLoggedIn || !headers || (!headers.Authorization && Platform.OS !== 'web')) {
      return
    }

    try {
      setIsFetched(true)
      const apiHeaders = new Headers(headers)
      apiHeaders.append('Accept', 'application/json')
      const response = await fetch(API_URL, {
        headers: apiHeaders,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch attending challenge events')
      }

      const events: ChallengeEvent[] = await response.json()
      setEvents(events)
    } catch (error) {
      logError(error, 'Error fetching challenge events', {
        location: 'AttendingChallengeEvents.fetchAttendingEvents',
      })
    }
  }, [isLoggedIn, headers, fetched])

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
              <AttendingChallengeEventsCardLegacy challengeEvent={item} />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </HoliContainer>
  )
}

export default withProfiler(AttendingChallengeEvents, {
  name: 'AttendingChallengeEvents',
})

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
      paddingLeft: 24,
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
