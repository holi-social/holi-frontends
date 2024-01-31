import { withProfiler } from '@sentry/react'
import type { PropsWithChildren } from 'react'
import React, { Suspense } from 'react'
import { StyleSheet } from 'react-native'

import RootProvider from '@holi/core/providers/RootProvider'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const styles = StyleSheet.create({
  loadingContainer: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginTop: 100,
  },
})

const ClientRootProvider = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Suspense
      fallback={
        <SafeArea style={styles.loadingContainer}>
          <HoliLoader />
        </SafeArea>
      }
    >
      <RootProvider>{children}</RootProvider>
    </Suspense>
  )
}

export default withProfiler(ClientRootProvider, { name: 'ClientRootProvider' })
