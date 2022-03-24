import React from 'react'
import { StyleSheet, Text } from 'react-native'
import SpaceLayout from 'shared/features/spaces/layout'
import AppTiles from 'shared/features/spaces/components/AppTiles'

const HomeScreen: React.VoidFunctionComponent = () => {
  return (
    <SpaceLayout>
      <Text style={styles.header}>Hello Anna</Text>
      <Text style={styles.subHeader}>Nice to see you here!</Text>
      <AppTiles style={{ marginTop: 40 }} />
    </SpaceLayout>
  )
}

export default HomeScreen

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
