import React from 'react'
import { StyleSheet, Text } from 'react-native'

import SpaceLayout from '@holi/core/spaces/spaceLayout'

const AppStoreScreen: React.VoidFunctionComponent = () => {
  return (
    <SpaceLayout>
      <Text style={styles.header}>App Store</Text>
      <Text style={styles.subHeader}>Choose the apps you wanna use!</Text>
    </SpaceLayout>
  )
}

export { AppStoreScreen }

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
  },
  subHeader: {
    textAlign: 'center',
    marginTop: 10,
  },
})
