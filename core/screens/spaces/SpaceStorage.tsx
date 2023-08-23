import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import HoliWebView from '@holi/core/components/HoliWebView'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { getUrlForSpaceStorage } from '@holi/core/screens/spaces/helpers/urls'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { vars } from '@holi/ui/styles/globalVars'

export type SpaceStorageParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceStorageParams>()

const SpaceStorage: React.FC = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })
  const space = data?.spaceById
  const storageUrl = getUrlForSpaceStorage(space)
  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small" numberOfLines={1}>
          {t('spaces.storage.title')}
        </HoliHeading>
      ),
    })
  }, [setScreenOptions, t])

  if ((error && isNotFoundError(error)) || (!loading && !space)) {
    return (
      <DefaultLayout style={styles.defaultLayout} contentStyle={styles.messageContainer}>
        <HoliText>{t('spaces.spaceDetails.notFound', { spaceIdOrName })}</HoliText>
      </DefaultLayout>
    )
  }
  if (error) {
    logError(error, `[SpaceStorage.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !space) {
    return <></>
  }

  if (Platform.OS === 'web') {
    // Directly redirect to the storage
    window.location.href = storageUrl
    return null
  }

  return (
    <DefaultLayout hasFooterTabBar={false}>
      <HoliWebView
        style={styles.webView}
        webViewProps={{ setSupportMultipleWindows: false, source: { uri: storageUrl } }}
      />
    </DefaultLayout>
  )
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    webView: {
      minHeight: deviceHeight - +vars.topBarHeight,
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: vars.topBarHeight + 50,
    },
    defaultLayout: {
      paddingBottom: 0,
      ...Platform.select({
        web: {
          minHeight: '100vh',
        },
      }),
    },
  })

export default withProfiler(SpaceStorage, { name: 'SpaceStorage' })
