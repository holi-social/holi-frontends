import { useAllEventsQuery } from '@holi/api/graphql/graphql-codegen'
import { logError } from '@holi/core/errors/helpers'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useCallback, useState } from 'react'

export const useEventListData = (limit: number, localOnly: boolean) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { data, fetchMore, loading } = useAllEventsQuery({
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    variables: {
      limit: limit,
      offset: 0,
      localOnly: localOnly,
    },
  })

  const events = data?.appEvents_events.data
  const totalResults = data?.appEvents_events.totalResults
  const canLoadMore = !loading && events?.length && events?.length < (totalResults || 0)

  const fetchMoreEvents = useCallback(async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)

    try {
      await fetchMore({
        variables: {
          limit: 10,
          offset: events?.length ? Math.ceil(events?.length / 10) : 0,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.appEvents_events.data) return prev
          return {
            appEvents_events: {
              ...prev.appEvents_events,
              data: [...(prev.appEvents_events.data || []), ...fetchMoreResult.appEvents_events.data],
            },
          }
        },
      })
    } catch (error) {
      logError(error, 'Failed to fetch more', {
        location: 'EventList.fetchMoreEvents',
      })
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, fetchMore, events?.length])

  return { events, canLoadMore, fetchMoreEvents }
}
