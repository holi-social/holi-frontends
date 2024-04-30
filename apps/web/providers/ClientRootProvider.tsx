import { withProfiler } from '@sentry/react'
import type { PropsWithChildren } from 'react'
import React, { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { StyleSheet } from 'react-native'

import i18n, { initI18n } from '@holi/core/i18n'
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
  const [translationsLoaded, setTranslationsLoaded] = useState(i18n.isInitialized)

  useEffect(() => {
    initI18n().then(() => {
      setTranslationsLoaded(true)
    })
  }, [])

  return translationsLoaded ? (
    <I18nextProvider i18n={i18n}>
      <RootProvider>{children}</RootProvider>
    </I18nextProvider>
  ) : (
    // FIXME: Use Suspence
    <SafeArea style={styles.loadingContainer}>
      <HoliLoader />
    </SafeArea>
  )
}

export default withProfiler(ClientRootProvider, { name: 'ClientRootProvider' })
