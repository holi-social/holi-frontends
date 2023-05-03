import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import HoliWebView from '@holi/core/screens/spaces/components/HoliWebView'
import { getUrlForSpaceStorage } from '@holi/core/screens/spaces/helpers/urls'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { vars } from '@holi/ui/styles/globalVars'

export type SpaceStorageParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceStorageParams>()

const SpaceStorage: React.VFC<SpaceStorageParams> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })
  const space = data?.spaceById
  const storageUrl = getUrlForSpaceStorage(space)

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
  } else {
    return (
      <DefaultLayout>
        <HoliWebView style={styles.webView} uri={storageUrl} />
      </DefaultLayout>
    )
  }
  return null
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    webView: {
      minHeight: deviceHeight,
      marginTop: vars.topBarHeight,
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

export default SpaceStorage
