import React from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import HoliWebView from '@holi/core/screens/spaces/components/HoliWebView'
import { owncloudUrl } from '@holi/core/screens/spaces/helpers/config'

export interface SpaceStorageParams {
  spaceIdOrName: string
}

const SpaceStorage: React.VFC<SpaceStorageParams> = () => {
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)

  return (
    <DefaultLayout>
      <HoliWebView style={styles.webView} uri={owncloudUrl} />
    </DefaultLayout>
  )
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    webView: {
      minHeight: deviceHeight,
    },
  })

export default SpaceStorage
