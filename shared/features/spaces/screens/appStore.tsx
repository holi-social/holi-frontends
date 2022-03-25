import React from 'react'
import { StyleSheet, Text } from 'react-native'
import SpaceLayout from 'shared/features/spaces/spaceLayout'

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
    marginTop: 50,
  },
  subHeader: {
    textAlign: 'center',
    marginTop: 10,
  },
})
