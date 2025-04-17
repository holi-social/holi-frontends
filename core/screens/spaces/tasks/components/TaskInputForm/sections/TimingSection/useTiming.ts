import type { Duration, Regularity } from '@holi/api/graphql/graphql-codegen'
import { useCallback, useState } from 'react'

export const useTiming = () => {
  const [duration, setDuration] = useState<Duration | undefined>(undefined)
  const [regularity, setRegularity] = useState<Regularity | undefined>(undefined)

  return {
    duration,
    regularity,
    // useCallback needed to use these functions in dependency array of useEffect
    onDurationChange: useCallback((value: Duration | undefined) => setDuration(value), []),
    onRegularityChange: useCallback((value: Regularity) => setRegularity(value), []),
  }
}

export type UseTimingReturnValue = ReturnType<typeof useTiming>
