import React, { useEffect } from 'react'

import { setErrorStatusCode, useErrorStatusCodeVar } from '@holi/api/graphql/client'
import useRouting from '@holi/core/navigation/hooks/useRouting/useRouting'

const SessionExpiryProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const isError = useErrorStatusCodeVar()
  const { navigate } = useRouting()

  useEffect(() => {
    if (isError) {
      setErrorStatusCode(false)
      // TODO: provide path
      navigate('/')
    }
  }, [isError, navigate])

  return <>{children}</>
}

export default SessionExpiryProtection
