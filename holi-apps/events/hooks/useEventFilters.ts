import { useCallback, useState } from 'react'

import createParamHooks, { singleParamConfig, webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'

import type { EventFilterParams, EventFilters } from '@holi-apps/events/components/EventsFilterForm'

interface FilterHook {
  filters: EventFilters
  setFilters: (filters?: EventFilters) => void
  clearFilters: () => void
  isFiltering: boolean
}

const { useParam, useUpdateParams } = createParamHooks<EventFilterParams>()

const useDiscoveryV1Filters = (): FilterHook => {
  const [remoteParam] = useParam('remote', singleParamConfig)
  const remote = remoteParam === 'true'
  const [date] = useParam('date', singleParamConfig)
  const updateParams = useUpdateParams(webReplaceQueryConfig)

  const [filters, setFilters] = useState<EventFilters>({ remote, date })
  const isFiltering = !!(filters.date || filters.remote)

  const onFilterChange = useCallback(
    ({ remote, date }: EventFilters = {}) => {
      setFilters({ remote, date })
      updateParams({ remote: remote?.toString(), date: date })
    },
    [updateParams]
  )
  const clearFilters = useCallback(() => {
    setFilters({})
    updateParams({
      date: undefined,
      remote: undefined,
    })
  }, [updateParams])

  return { filters, setFilters: onFilterChange, clearFilters, isFiltering }
}

// todo: review everything, this is a copy-paste from volunteering and not used yet
export const useEventFilters = (onSubmit: () => void) => {
  const { setFilters, filters, clearFilters, isFiltering } = useDiscoveryV1Filters()

  const submit = useCallback(
    (filters?: EventFilters) => {
      setFilters(filters)
      onSubmit()
    },
    [onSubmit, setFilters]
  )

  // useEffect(() => {
  //   setFilters({ ...filters })
  // }, [setFilters])

  return { setFilters, filters, clearFilters, isFiltering, submit }
}
