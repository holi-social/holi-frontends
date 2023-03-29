import React from 'react'
import { Linking, Platform, StyleSheet, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import HoliWebView from '@holi/core/screens/spaces/components/HoliWebView'
import { owncloudUrl } from '@holi/core/screens/spaces/helpers/config'
import { vars } from '@holi/ui/styles/globalVars'

export interface SpaceStorageParams {
  spaceIdOrName: string
}

const SpaceStorage: React.VFC<SpaceStorageParams> = () => {
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)

  if (Platform.OS !== 'web') {
    return (
      <DefaultLayout>
        <HoliWebView style={styles.webView} uri={owncloudUrl} />
      </DefaultLayout>
    )
  } else {
    Linking.openURL(owncloudUrl)
  }
  return null
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    webView: {
      minHeight: deviceHeight,
      marginTop: vars.topBarHeight,
    },
  })

export default SpaceStorage
