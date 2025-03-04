import { useQuery } from '@apollo/client'
import type React from 'react'
import { createContext } from 'react'

import type { SDG, SdgsQueryResult } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import { sdgsQuery } from '@holi/core/screens/spaces/queries'

export interface SpaceTermContextResult {
  loadingSdgs: boolean
  failedSdgs: boolean
  sdgs: readonly SDG[]
}

const initialState = {
  loadingSdgs: true,
  failedSdgs: false,
  sdgs: [],
}

// TODO(SF) rename
export const SpaceTermContext = createContext<SpaceTermContextResult>(initialState)
SpaceTermContext.displayName = 'SpaceTermContext'

const SpaceTermContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const {
    loading: loadingSdgs,
    data: sdgsData,
    error: errorSdgs,
  } = useQuery<SdgsQueryResult>(sdgsQuery, {
    onError: (error) =>
      logError(error, 'Failed to load SDGs', {
        location: 'SpaceTermContextProvider.sdgsQuery',
      }),
  })
  const sdgs = sdgsData?.sdgs.data || []

  return (
    <SpaceTermContext.Provider
      value={{
        loadingSdgs,
        failedSdgs: !!errorSdgs,
        sdgs,
      }}
    >
      {children}
    </SpaceTermContext.Provider>
  )
}

export default SpaceTermContextProvider
