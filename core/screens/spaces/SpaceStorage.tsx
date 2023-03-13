import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
// import { useScrollYHandler } from '@holi/core/helpers'
import HoliWebView from '@holi/core/screens/spaces/components/HoliWebView'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceStorageParams = {
  spaceIdOrName: string
}

const SpaceStorage: React.VFC<SpaceStorageParams> = () => {
  const mixins = useStyleMixins()
  // const onScreenScroll = useScrollYHandler()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)

  return (
    <DefaultLayout /*onScroll={onScreenScroll} scrollEventThrottle={200}*/ style={styles.wrapper}>
      <View style={{ height: deviceHeight }}>
        <HoliWebView
          style={[
            mixins.container,
            styles.messageContainer,
            { backgroundColor: 'red', borderColor: 'blue', borderWidth: 2 },
          ]}
          // TODO(SF) move to env vars
          uri={'https://dev.cloud.project-holi.org'}
        />
      </View>
    </DefaultLayout>
  )
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background20,
      minHeight: deviceHeight,
    },
    grid: {
      marginTop: 32,
    },
    buttonContainer: {
      marginTop: 20,
    },
    buttonText: {
      marginRight: 6,
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: 50,
    },
    noResults: {
      marginTop: 24,
    },
  })

export default SpaceStorage
