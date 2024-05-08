import { withProfiler } from '@sentry/react'
import type { PropsWithChildren } from 'react'
import React from 'react'

import RootProvider from '@holi/core/providers/RootProvider'

const ClientRootProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <RootProvider>{children}</RootProvider>
}

export default withProfiler(ClientRootProvider, { name: 'ClientRootProvider' })
