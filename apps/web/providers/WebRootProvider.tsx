import { getApolloContext } from '@apollo/client/react'
import { BricksTheme } from 'holi-bricks/foundations/colors/themes/bricks-theme'
import type { PropsWithChildren } from 'react'
import React, { useContext } from 'react'

import RootProvider from '@holi/core/providers/RootProvider'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import { useApolloWebClient } from '@holi/web/helpers/useApolloWebClient'
import type { HoliPageProps } from '@holi/web/types'
import { WebRouteHistoryInitializer } from '@holi/web/providers/WebRouteHistoryInitializer'
import OnboardingInitializer from '@holi/core/screens/onboarding/OnboardingInitializer'
interface RootProviderProps {
  pageProps: HoliPageProps
}

const WebRootProvider = ({ children, pageProps }: PropsWithChildren<RootProviderProps>) => {
  // Apollo context is only available on the server side: client side will create new client from page props
  const apolloWebClient = useApolloWebClient(pageProps)
  const apolloContext = useContext(getApolloContext())
  const apolloClient = apolloContext.client ?? apolloWebClient

  return (
    <BricksTheme initialTheme={'light'}>
      <ThemeProvider theme={defaultHoliTheme}>
        <RootProvider apolloClient={apolloClient} posthogBootstrapState={pageProps.posthogBootstrapValues}>
          <WebRouteHistoryInitializer />
          <OnboardingInitializer />
          {children}
        </RootProvider>
      </ThemeProvider>
    </BricksTheme>
  )
}

export default WebRootProvider
