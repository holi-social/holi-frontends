import { withProfiler } from '@sentry/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { useLoginState } from '@holi/core/auth/loginState'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

import AttendingChallengeEventsCard from '@holi-apps/challenges/components/AttendingChallengeEventsCard'
import type { ChallengeEvent } from '@holi-apps/challenges/components/types'
import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'
import { Spacing } from 'holi-bricks/tokens'
import { apiUrl } from '@holi-apps/challenges/helpers/navigation'

const API_URL = apiUrl('/api/v1/events/userAttendingEvents')

const CARD_WIDTH = 260

export const calculateCardWidth = (screenWidth: number) =>
  Platform.OS === 'web' ? CARD_WIDTH : screenWidth - Spacing.xl

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
  )
}

export default withProfiler(AttendingChallengeEvents, {
  name: 'AttendingChallengeEvents',
})

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
    listContainer: {
      gap: Spacing['4xs'],
    },
    itemContainer: {
      width: cardWidth,
      marginRight: Spacing['xxs'],
    },
    lastItem: {
      marginRight: 44,
    },
  })
